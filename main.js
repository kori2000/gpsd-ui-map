const Gpsd = require('node-gpsd-client')

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const dotenv = require('dotenv')

// Load ENV data
dotenv.config()

// Settings
const GPSD_SERVER = process.env.GPSD_SERVER || "localhost"
const GPSD_PORT = process.env.GPSD_PORT || 2947
const GPSD_LOG = process.env.GPSD_LOG || 0
const EXPRESS_PORT = process.env.EXPRESS_PORT || 4001

// GPSD Client
const client = new Gpsd({
  port: GPSD_PORT,
  hostname: GPSD_SERVER,
  parse: true
})

client.on('connected', () => {
  console.log('\nGPSD Client connected 🚀')
  client.watch({
    class: 'WATCH',
    json: true,
    scaled: true
  })
})

client.on('error', err => {
  console.log(`GPSD Error: ${err.message}`)
})

client.on('TPV', data => {
  if (GPSD_LOG == 1) {
    console.log(data)
  }
  io.emit('position', data)
})

client.connect()

// EXPRESS API
http.listen(EXPRESS_PORT, function() {
  console.log(`GPSD Server on...........IP : ${GPSD_SERVER}`)
  console.log(`GPSD Server on.........PORT : ${GPSD_PORT}`)
  console.log(`HTTPS / MAP on.........PORT : ${EXPRESS_PORT}`)
})

app.get('/', function (req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(__dirname + '/public/index.html')
})