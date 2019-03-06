const debug = require('debug')('webmaster:deploy:application')
const express = require('express')

const router = express.Router()

router.get('/:name', async (req, res) => {
  const { name } = req.params
  const doc = await req.node.db.get('applications').findOne({ name })
  if (!doc) {
    return res.status(404).send('application not found')
  }
  return res.send(doc)
})

router.post('/', async (req, res) => {
  const { db } = req.node
  const { name, token } = req.body
  const session = await db.get('sessions').findOne({ _id: token })
  if (!session) {
    return res.status(403).send()
  }
  const { userId } = session
  const applications = db.get('applications')
  const exists = await applications.count({ name, userId })
  if (exists) {
    debug('application %s by %s already exists', name, userId)
    return res.status(409).send('application already exists')
  }
  const _id = Math.random()
    .toString(36)
    .substring(7)
  const inserted = await applications.insert({ _id, name, userId })
  debug('application is created %s', inserted._id)
  res.send(inserted)
})

module.exports = router
