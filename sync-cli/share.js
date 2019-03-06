const path = require('path')

const { argv } = require('yargs')

const init = require('./init')
init(argv.share)

const { id, key } = require('./metadata')()

console.log(`Run the following command to start sharing with other party:
$ microverse-sync --join ${id} --key ${key} --path ${path.basename(
  process.cwd(),
)}
`)
