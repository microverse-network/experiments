const fs = require('fs')

const debug = require('debug')

const Base = require('@microverse-network/core/base')

const fsStat = require('./fs/stat')

module.exports = class File extends Base {
  constructor(options = {}) {
    super(options)
    Object.assign(this, options)
    this.debug = debug(`microverse-sync:file:${this.path}`)
    fs.watch(this.path, event => this.emit(event))
  }

  bindEventListeners() {
    super.bindEventListeners()
    this.on('change', () => this.compareMtime())
  }

  async compareMtime() {
    const lStat = await fsStat(this.path)
    const rStat = await this.remote.fsStat(this.path)

    if (!lStat) {
      this.debug('missing local stat')
      return false
    } else if (!rStat) {
      this.debug('missing remote stat')
      return true
    }

    if (lStat.mtimeMs > rStat.mtimeMs) {
      const { mtimeMs: mtime } = await fsStat(this.path)
      const options = {
        times: { mtime },
      }
      this.emit('send', options)
    }
  }
}
