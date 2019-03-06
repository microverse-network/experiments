const fs = require('fs')
const path = require('path')

const Base = require('@microverse-network/core/base')

const debug = require('debug')('microverse-sync:fs/scan')

module.exports = class FSScan extends Base {
  run(root = '.') {
    const dirents = fs.readdirSync(root, { withFileTypes: true })
    dirents.forEach(dirent => {
      if (dirent.name === '.sync') return
      const direntPath = path.join(root, dirent.name)
      if (dirent.isFile()) {
        debug('file %s', direntPath)
        this.emit('file', direntPath)
      } else if (dirent.isDirectory()) {
        try {
          fs.accessSync(path.join(direntPath, '.sync'))
        } catch (e) {
          debug('directory %s', direntPath)
          this.run(direntPath)
        }
      }
    })
  }
}
