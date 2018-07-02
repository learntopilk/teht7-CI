const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')



loginRouter.post('/', async (req, res) => {

  const body = req.body

  console.log(body)
  const user = await User.findOne({ username: body.username })
  console.log(user)
  const passwordOK = user === null ?
    false : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordOK)) {
    return res.status(401).send('Invalid password or username!!!!!!')
  }

  const jwtBody = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(jwtBody, process.env.SECRET)

  res.status(200).send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter