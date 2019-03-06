const fs = require('fs')
const path = require('path')

module.exports = (workingDir = '.', syncDir = '.sync') => {
  const id = path.join(workingDir, syncDir, 'id')
  const key = path.join(workingDir, syncDir, 'key')
  return {
    id: fs.readFileSync(id).toString(),
    key: fs.readFileSync(key).toString(),
  }
}
