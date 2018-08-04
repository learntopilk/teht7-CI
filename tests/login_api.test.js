const supertest = require('supertest')
const { app, server } = require('../index.js')
const api = supertest(app)
//const Blog = require('../models/blog')
//const User = require('../models/user')
const { blogsInDb, initialBlogs, usersInDb } = require('../utils/tests_helper.js')

beforeAll(async () => {

})

describe('TestSet1', () => {
  test('Login possible', async () => {
    const result = await api.post('/api/login')
      .send({ username: 'salaatti', password: 'kastike' })

    expect(200)
    expect(Object.keys(result.body)).toContain('token')
  })
})

afterAll(() => {
  server.close()
})