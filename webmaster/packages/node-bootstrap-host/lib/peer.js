const Peer = require('microverse-core/lib/daemon')

module.exports = class BootstrapHostPeer extends Peer {
  constructor(options) {
    const peerOptions = {
      id: options.id,
      bootstrap: {
        _id: 'bootstrap',
        transports: ['websocket'],
        websocket: {
          url: options['bootstrap-url'],
        },
      },
      transportOptions: {
        port: options['node-port'],
        url: options['node-url'],
      },
    }
    super(peerOptions)
  }
}
