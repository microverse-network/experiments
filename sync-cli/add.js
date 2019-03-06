const { id, key } = require('@microverse-network/sync/metadata')()

console.log(`Run the following command to start syncing:
$ microverse-sync --id ${id} --key ${key}
`)
