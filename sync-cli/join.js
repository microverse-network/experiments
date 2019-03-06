const { argv } = require('yargs')

const { join: id, key, path: workingDir } = argv

const init = require('./init')
init(workingDir, {
  metadata: { id, key },
})
