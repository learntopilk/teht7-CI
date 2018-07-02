const tokenDigger = (req, res, next) => {

  const tokenHeader = req.get('authorization')
  console.log(req.headers)
  console.log('auth: ', tokenHeader)

  if (tokenHeader && tokenHeader.toLowerCase().startsWith('bearer')) {
    req.body.token = tokenHeader.substring(7)
    //return auth.substring(7)
  } else {
    null
  }

  next()
}

module.exports = tokenDigger