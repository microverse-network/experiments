const debug = require('debug')('webmaster:auth:login')

const decorators = require('../decorators')

module.exports = async (req, res) => {
  const { db } = req.node
  const { email, password } = req.body
  const user = await db.get('users').findOne({ email, password })
  if (user) {
    const session = await db.get('sessions').insert({ userId: user._id })
    debug('logged in %s %s', email, session._id)
    res.send({
      session: decorators.session(session),
      user: decorators.user(user),
    })
  } else {
    debug('failed login attempt %s', email)
    res.status(401).send()
  }
}
