const fs = require('fs')

const cryptoRandomString = require('crypto-random-string')

module.exports = (options = {}) => {
  const id = options.id || cryptoRandomString(16)
  const key = options.key || cryptoRandomString(32)
  const fsOptions = { mode: 0o400 }
  fs.writeFileSync('.sync/id', id, fsOptions)
  fs.writeFileSync('.sync/key', key, fsOptions)
  console.log(`Your identity is ${id}`)
}
