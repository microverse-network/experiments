const fs = require('fs')

const debug = require('debug')('microverse-sync:fs/utimes')

module.exports = (path, { mtime }) => {
  const newTime = new Date(mtime)
  return fs.utimesSync(path, newTime, newTime)
}
