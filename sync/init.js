const fs = require('fs')
const path = require('path')

const debug = require('debug')('microverse-sync')

const initMetadata = require('./metadata/init')

const defaultMainDirectory = path.join(process.env.HOME, 'microverse-sync')
const mainDirectory = process.env.MICROVERSE_SYNC_HOME || defaultMainDirectory

module.exports = (options = {}) => {
  const workingDirectory = options.workingDirectory || mainDirectory
  try {
    fs.accessSync(workingDirectory)
  } catch (e) {
    console.log('Creating the working directory')
    fs.mkdirSync(workingDirectory, { recursive: true })
  }

  debug('chdir %s', workingDirectory)
  process.chdir(workingDirectory)

  try {
    fs.accessSync('.sync/id')
  } catch (e) {
    try {
      fs.mkdirSync('.sync')
    } finally {
      initMetadata(options.metadata)
    }
  }
}
