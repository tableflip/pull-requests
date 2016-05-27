import DDPClient from 'node-ddp-client'

export default function (cb) {
  const ddpClient = new DDPClient({
    host: 'localhost',
    port: 3000,
    ssl: false,
    autoReconnect: true,
    autoReconnectTimer: 500,
    maintainCollections: true,
    ddpVersion: '1',
    useSockJs: true
  })

  ddpClient.connect((error, wasReconnect) => {
    if (error) {
      cb(false)
      return console.log('DDP connection error!')
    }

    if (wasReconnect) {
      console.log('Reestablishment of a connection.')
    }
    cb(true)
  })

  window.ddpClient = ddpClient
  return ddpClient
}
