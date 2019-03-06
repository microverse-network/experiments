const fs = require('fs')
const path = require('path')

const RPC = require('@microverse-network/core/module/rpc')

const metadata = require('./metadata')

const fsStat = require('./fs/stat')
const fsUtimes = require('./fs/utimes')
const FSScan = require('./fs/scan')

const File = require('./file')

const makeBufferTransformer = require('./buffertransformer')

module.exports = class Sync extends RPC {
  constructor(options = {}) {
    options.id = metadata(options.path).id
    super(options)
    this.auth = metadata(options.path)
    this.debug('path = %s', this.options.path)
    this.initSharedDirectories()
  }

  initSharedDirectories() {
    fs.readdirSync(this.options.path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => dirent.name !== '.sync')
      .forEach(dirent => {
        const direntPath = path.join(this.options.path, dirent.name)
        try {
          fs.accessSync(path.join(direntPath, '.sync'))
          return new Sync({ path: direntPath })
        } catch (e) {}
      })
  }

  init(mux) {
    const { connection } = mux
    this.once(`remote.${connection.peer}`, async remote => {
      if (this.authenticate(await remote.syncKey())) {
        this.start(mux, remote)
      } else {
        connection.close()
      }
    })
  }

  authenticate(remoteKey) {
    return remoteKey === this.auth.key
  }

  async start(mux, remote) {
    const scanner = new FSScan()
    scanner.on('file', path => {
      const file = new File({ path, remote })
      file.on('send', (...args) => this.send(path, remote, ...args))
      file.emit('ready')
    })
    scanner.run(this.options.path)
  }

  handleMux(mux) {
    super.handleMux(mux)
    this.init(mux)
  }

  handleStream(stream, ...args) {
    super.handleStream(stream, ...args)
    const fileStream = stream.meta.match(/^file:(.*)/)
    if (fileStream) {
      this.receive(fileStream[1], stream)
    }
  }

  send(path, remote, options) {
    this.debug('send %s', path)
    const readable = fs.createReadStream(path)
    const writable = remote.$stream.mux.createStream(getFileStreamName(path))
    readable.pipe(writable)
    writable.once('close', () => remote.fsUtimes(path, options.times))
  }

  receive(filePath, stream) {
    const { dir } = path.parse(filePath)
    if (dir) fs.mkdirSync(dir, { recursive: true })
    stream.pipe(makeBufferTransformer()).pipe(fs.createWriteStream(filePath))
  }

  getProtocol(methods = {}) {
    super.getProtocol(methods)
    methods.syncKey = () => this.auth.key
    methods.fsStat = fsStat
    methods.fsUtimes = fsUtimes
    return methods
  }
}

const getFileStreamName = name => `file:${name}`
