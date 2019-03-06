const _ = require('lodash')
const debug = require('debug')('webmaster:deploy:deploy')
const express = require('express')

const router = express.Router()

router.param('applicationId', async (req, res, next, _id) => {
  req.application = await req.node.db.get('applications').findOne({ _id })
  if (!req.application) {
    debug('application not found %s', _id)
    return res.status(403).send()
  }
  next()
})

router.param('deploymentId', async (req, res, next, _id) => {
  req.deployment = await req.node.db.get('deployments').findOne({ _id })
  if (!req.deployment) {
    debug('deployment not found %s', _id)
    return res.status(403).send()
  }
  next()
})

router.post('/:applicationId', async (req, res) => {
  const { applicationId } = req.params
  const state = 'created'
  const _id = Math.random()
    .toString(36)
    .substring(7)
  const doc = { _id, applicationId, state }
  const inserted = await req.node.db.get('deployments').insert(doc)
  debug('deployment is created %s', inserted._id)
  res.send(inserted)
})

router.post('/upload/:deploymentId', async (req, res) => {
  if (!req.files) {
    return res.status(400).send('no files uploaded')
  }
  const { applicationId } = req.deployment
  const { deploymentId } = req.params
  const files = _.map(req.files, ({ name, mimetype, data }, path) => {
    return {
      applicationId,
      deploymentId,
      name,
      path,
      mimetype,
      content: data.toString(),
    }
  })
  await req.node.db.get('repository').insert(files)
  res.send()
})

module.exports = router
