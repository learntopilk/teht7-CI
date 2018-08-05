

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  console.log('not production')
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  console.log('TEST ENVIRONMENT')
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
  console.log('Process.env: ', process.env)
}

console.log(port, mongoUrl, "PORT AND MONGOURL")

module.exports = { port, mongoUrl }