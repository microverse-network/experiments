const debug = require('debug')('webmaster:payment:customer')
const express = require('express')

const router = express.Router()

router.get('/:token', async (req, res) => {
  const { db } = req.node
  const { token } = req.params
  const session = await db.get('sessions').findOne({ _id: token })

  if (!session) {
    debug('session is not found %s', token)
    return res.status(401).send()
  }

  const user = await db.get('users').findOne({ _id: session.userId })

  if (!user) {
    debug(
      'session belongs to non-existent user %s %s',
      session._id,
      session.userId,
    )
    return res.status(401).send()
  }

  const customer = await db.get('customers').findOne({ userId: user._id })

  if (!customer) {
    debug('user %s is is not registered as a stripe customer', user._id)
    return res.status(404).send()
  }

  const stripeCustomer = await req.stripe.customers.retrieve(
    customer.customerId,
  )

  if (stripeCustomer.deleted) {
    debug('customer record is missing on stripe')

    await db.get('customers').remove({ _id: customer._id })
    return res.status(404).send()
  }

  return res.status(200).send(stripeCustomer)
})

router.post('/', async (req, res) => {
  debug('customer create with payload = %O', req.body)
  const { db } = req.node
  const { token } = req.body
  const session = await db.get('sessions').findOne({ _id: token })

  if (!session) {
    debug('session is not found %s', token)
    return res.status(401).send()
  }

  const user = await db.get('users').findOne({ _id: session.userId })

  if (!user) {
    debug(
      'session belongs to non-existent user %s %s',
      session._id,
      session.userId,
    )
    return res.status(401).send()
  }

  const { number, exp_month, exp_year, cvc, name, address_zip } = req.body

  try {
    const stripeCustomer = await req.stripe.customers.create({
      email: user.email,
      source: {
        object: 'card',
        number,
        exp_month,
        exp_year,
        cvc,
        name,
        address_zip,
      },
    })

    const customer = await db.get('customers').insert({
      customerId: stripeCustomer.id,
      userId: user._id,
    })

    res.status(200).send(customer)
  } catch (error) {
    debug('error while trying to create stripe customer = %s', error.message)
    res.status(500).send()
  }
})

module.exports = router
