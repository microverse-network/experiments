const debug = require('debug')('webmaster:web:bootstrap-config')
const cheerio = require('cheerio')

module.exports = (bootstrap, file) => {
  const $ = cheerio.load(file.content)
  const config = JSON.stringify(
    {
      bootstrap: {
        node: {
          _id: 'bootstrap',
          transports: ['websocket'],
          websocket: {
            port: bootstrap.node.port,
            url: bootstrap.node.url,
          },
        },
      },
      node: {
        transportOptions: {
          webrtc: {
            host: bootstrap.signal.host,
            port: bootstrap.signal.port,
          },
          websocket: {},
        },
      },
    },
    null,
    2,
  )
  $('#microverse-config').text(`var _microverse_config_ = ${config}`)
  file.content = $.html()
}
