

const dummy = () => {
  // ...
  //console.log('Here be blogs (or frogs?).', blogs)
  return 1
}

const totalLikes = (blogs) => {

  let i = 0
  blogs.forEach(b => {i += b.likes})

  return i

}

const favoriteBlog = (blogs) => {
  let mostLikedBlog = {}
  let mostLikes = 0

  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      mostLikedBlog = blog
      mostLikes = blog.likes
    }
  })

  //console.log(mostLikedBlog)
  return mostLikedBlog
}

const mostBlogs = (blogs) => {

  let counts = {}
  //let alreadyFound = []

  let authorsOfEachPost = blogs.map(b => b.author)

  authorsOfEachPost.forEach(a => {
    if (counts[a]) {
      counts[a]++
    } else {
      counts[a] = 1
      //alreadyFound.push(a)
    }
  })

  let mostBlogs = 0
  let mostProlific
  Object.keys(counts).forEach(key => {
    if (counts[key] > mostBlogs) {
      mostProlific = key
      mostBlogs = counts[key]
    }
  })

  //console.log(mostProlific)
  return { [mostProlific]: counts[mostProlific] }

}


// Ylempi tehtiin vähän eri tekniikalla paluuarvo-objektin suhteen.
// Noudatetaan nyt tarkemmin ohjeistusta.
const mostLikes = (blogs) => {
  let foundNames = []
  let authorsAndLikes = {}

  let maxLikes = 0
  let mostLiked

  blogs.forEach(b => {
    if (foundNames.includes(b.author)) {
      authorsAndLikes[b.author] += b.likes
    } else {
      authorsAndLikes[b.author] = b.likes
      foundNames.push(b.author)
    }
    console.log('found Names: ', foundNames)
  })

  console.log('authorsAndLikes: ', authorsAndLikes)

  Object.keys(authorsAndLikes).forEach( key => {
    if (authorsAndLikes[key] > maxLikes) {
      maxLikes = authorsAndLikes[key]
      mostLiked = key
    }
  })


  return { author: mostLiked, likes: maxLikes }
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}