const fs = require('fs')

module.exports = filename => {
  return new Promise(resolve => {
    try {
      resolve(fs.statSync(filename))
    } catch (e) {
      resolve(null)
    }
  })
}
