const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

const formatBlogPost = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user,
    id: blog._id,
    comments: blog.comments
  }
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 1, username: 1, _id: 1 })

  //console.log(blogs)
  response.json(blogs.map(b => formatBlogPost(b)))

})

blogsRouter.post('/', async (req, res) => {


  try {
    const token = req.body.token

    if (!token) {
      //console.log('no token')
      return res.status(400).send({ error: 'No token found in request' })
    }

    const decoded = jwt.verify(token, process.env.SECRET)

    if (!token || !decoded.id) {
      return res.status(401).send('Invalid or missing token')
    }

    if (!req.body.title || !req.body.url) {
      console.log('title: ', req.body.title, 'url: ', req.body.url)
      return res.status(400).send('Missing a title or url')
    }

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(403).send('User not found!')
    }

    let author
    if (!req.body.author || req.body.author === '') {
      author = 'Unknown'
    } else {
      author = req.body.author
    }

    let likes
    if (!req.body.likes) {
      likes = 0
    } else {
      likes = req.body.likes
    }

    const blog = new Blog({
      title: req.body.title || 'test',
      author,
      url: req.body.url || '',
      likes,
      user: user._id
    })

    const result = await blog.save()
    //console.log('blogs, notes, notes:')
    console.log(user.blogs)
    if (!user.blogs) {
      user.blogs = []
    }
    //console.log(user.blogs)

    user.blogs = user.blogs.concat(result._id)
    //console.log(user.blogs)

    await user.save()

    res.status(201).json(formatBlogPost(result))
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Something went seriously wrong.' })
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  let token
  try {
    token = request.body.token
    if (!token) {
      return response.status(403).json({ error: 'No token supplied with request' })
    }
  } catch (e) {
    console.log(e)
    return response.status(500)
  }

  const decoded = jwt.verify(token, process.env.SECRET)
  if (!decoded.id) {
    return response.status(401).send('Invalid token')
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete || !blogToDelete._id) {
    return response.status(404).json({ error: 'Not found' })
  }
  console.log('check-up: ')
  //console.log(blogToDelete.user)
  //console.log(decoded.id)
  if (blogToDelete.user.toString() !== decoded.id.toString() || !blogToDelete.user.toString() || blogToDelete.user.toString() === '') {
    return response.status(403).send({ error: 'Incorrect user' })
  }


  console.log('deleting...')

  await Blog.remove({ _id: request.params.id })
    .catch(err => {
      console.log('err: ', err)
      return response.status(400)
    })
  response.status(200).end()
  console.log('Deleted')
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('updating...')

  const b = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: Number(request.body.likes)
  }

  const updatedB = await Blog
    .findByIdAndUpdate({ _id: request.params.id }, b, { new: true })
    .catch(err => {
      console.log('error updating: ', err)
      return response.status(404)
    })
  response.status(200).json(formatBlogPost(updatedB))

})

blogsRouter.get('/:id/comments', async (req, res) => {
  const comments = await Blog.find({ _id: req.params.id })

  if (comments === null || comments === undefined) {
    return res.status(200).json(null)
  }

  res.status(200).json(comments)
})

blogsRouter.post('/:id/comments', async (req, res) => {

  if(!req.body.comment || req.body.comment === '') {
    return res.status(401).json({ error: 'bad request, Either the comment is missing or is empty'})
  }

  console.log('req.body.comment: ', req.body.comment)
  try {
    const b = await Blog.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: req.body.comment } })
    console.log(b)
    const newB = b
    newB.comments = newB.comments.concat(req.body.comment)
    return res.status(201).json(formatBlogPost(newB))
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'error while saving comment' })
  }


})

module.exports = blogsRouter