const debug = require('debug')('webmaster:auth:register')

const decorate = require('../decorators/user')

module.exports = async (req, res) => {
  const { db } = req.node
  const { email, name, password } = req.body
  const users = db.get('users')
  const exists = (await users.find({ email })).length
  if (exists) {
    debug('already registered %s', email)
    res.status(409).send('email is already registered')
  } else {
    const doc = { email, name, password }
    const inserted = await users.insert(doc)
    debug('registered %s %s', email)
    res.send(decorate(inserted))
  }
}
