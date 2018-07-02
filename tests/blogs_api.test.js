const supertest = require('supertest')
const { app, server } = require('../index.js')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { blogsInDb, initialBlogs, usersInDb } = require('../utils/tests_helper.js')


beforeAll(async () => {
  await Blog.remove({})

  const blogObjs = initialBlogs.map(b => new Blog(b))
  await Promise.all(blogObjs.map(b => b.save()))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('new blog post can be added', async () => {
  const blogsPreviously = await blogsInDb()

  const b = {
    'title': 'fresh Post',
    'author': 'prince de Bel Air',
    'url': 'http://localhost:2222',
    'likes': 680313
  }

  await api
    .post('/api/blogs')
    .send(b)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const res = await api
    .get('/api/blogs')

  const contents = res.body.map(bl => bl.title)

  expect(res.body.length).toBe(blogsPreviously.length + 1)
  expect(contents).toContainEqual('fresh Post')

})

test('blog with no content not added', async () => {
  const blogsPreviously = await blogsInDb()

  const b = { author: 'mark dillon' }

  await api
    .post('/api/blogs')
    .send(b)
    .expect(400)

  const currentBlogs = await blogsInDb()

  expect(currentBlogs.length).toBe(blogsPreviously.length)
})

test('POST to /api/blogs with no likes set receives likes = 0', async () => {
  const blogsPreviously = await blogsInDb()

  const b = {
    'title': 'Sweet Post',
    'author': 'prince de Bel Air',
    'url': 'http://localhost:2222'
  }

  const goodRes = await api
    .post('/api/blogs')
    .send(b)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(goodRes.body.likes).toBe(0)
  const currentBlogs = await blogsInDb()

  expect(currentBlogs.length).toBe(blogsPreviously.length + 1)
})

test('BAD REQUEST returned with POST call if url and title not supplied', async () => {
  const blogsPreviously = await blogsInDb()
  const incompleteBlogPost = {
    'author': 'Karmiva Burana',
    'likes': 41620879
  }

  await api
    .post('/api/blogs')
    .send(incompleteBlogPost)
    .expect(400)

  const res = await api
    .get('/api/blogs')
    .expect(200)

  expect(res.body.length).toBe(blogsPreviously.length)

})

test('Delete operation succeeds', async () => {
  const blogsPreviously = await blogsInDb()
  const idOfLastPost = blogsPreviously[(blogsPreviously.length - 1)].id

  await api
    .delete(`/api/blogs/${idOfLastPost}`)
    .expect(200)

  const currentBlogs = await blogsInDb()
  expect(currentBlogs.length).toBe(blogsPreviously.length - 1)
})

test('PUT operation succeeds', async () => {
  const blogsPreviously = await blogsInDb()
  const idOfLastPost = blogsPreviously[(blogsPreviously.length - 1)].id
  let updatedBlog = new Blog(blogsPreviously[(blogsPreviously.length - 1)])
  let previousLikes = updatedBlog.likes
  updatedBlog.likes++

  const res = await api
    .put(`/api/blogs/${idOfLastPost}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const currentBlogs = await blogsInDb()
  expect(currentBlogs.length).toBe(blogsPreviously.length)
  expect(res.body.likes).toBe(previousLikes + 1)
})

describe('User database tests', async () => {
  beforeAll(async () => {
    await User.remove({})
    const newUser = new User({
      username: 'poroot',
      name: 'Sari Skarppi',
      passwordHash: '4pa4w86b7apv4wob87',
      adult: true
    })
    await newUser.save()
  })

  test('POST to /api/users succeeds', async () => {
    const usersBefore = await usersInDb()

    const newUser = {
      username: 'salaatti',
      name: 'Hertta Herkullinen',
      password: 'kastike',
      adult: false
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(usersAfter.map(u => u.username)).toContain('salaatti')
  })

  test('POST to /api/users fails with too short a password', async () => {


    const incompleteUser = {
      username: 'freddie222',
      name: 'Fred freddieson',
      password: 'no',
      adult: true
    }

    await api
      .post('/api/users')
      .send(incompleteUser)
      .expect(400)
  })

  test('POST to /api/users sets field adult to true if none supplied', async () => {

    const usersBefore = await usersInDb()

    const incompleteUser = {
      username: 'freddie222',
      name: 'Fred freddieson',
      password: 'improperpassword',
    }

    await api
      .post('/api/users')
      .send(incompleteUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(usersAfter.map(u => u.username)).toContain(incompleteUser.username)


  })

  test('POST to api/users fails (returns 400) when username is already taken', async () => {
    const usersBefore = await usersInDb()



    const firstUser = {
      username: 'markip',
      name: 'Seppo Selkiö',
      password: 'pwd1',
      adult: true
    }

    await api
      .post('/api/users')
      .send(firstUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const secondUser = {
      username: 'markip',
      name: 'Selma Selkiö',
      password: 'pwd2',
      adult: true
    }

    await api
      .post('/api/users')
      .send(secondUser)
      .expect(400)

    const usersAfter = await usersInDb()

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(usersAfter.map(u => u.username)).toContain(firstUser.username)
    expect(usersAfter.map(u => u.name).includes(secondUser.name)).toBeFalsy

  })
})


afterAll(() => {
  server.close()
})