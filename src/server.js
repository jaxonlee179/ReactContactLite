const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const webSocketManager = require('./services/webSocketManager')

// Create the express server
const app = express()

// socketio expects to receive an http server, not an express server
// so just 'wrap' the express server in an http server
const server = http.createServer(app);

// Create the socketio server and register it with the webSocketManager
const socket = socketio(server)
socket.on('connection', () => {
    console.log('New connection')
    webSocketManager.registerWebSocket(socket)
})

require('./database/mongoose')

const appointmentRouter = require('./routers/appointmentRouter')
const companyRouter = require('./routers/companyRouter')
const encounterRouter = require('./routers/encounterRouter')
const emailRouter = require('./routers/emailRouter')
const personRouter = require('./routers/personRouter')
const positionRouter = require('./routers/positionRouter')
const attachmentRouter = require('./routers/attachmentRouter')
const loginRouter = require('./routers/loginRouter')

const port = process.env.CL_PORT || 5000

// Set up static directory to serve the client code
const public = path.join(__dirname, '../client/build')
app.use(express.static(public))

// Translate request body from JSON
app.use(express.json({type: [
    'text/plain',           // Used by all messages from SNS
    'application/json'      // For future use
]}))

app.use('*', (req, res, next) => {
    console.log(`${req.method}: ${req.originalUrl}`)
    next()
})

app.use(appointmentRouter)
app.use(companyRouter)
app.use(encounterRouter)
app.use(emailRouter)
app.use(personRouter)
app.use(positionRouter)
app.use(attachmentRouter)
app.use(loginRouter)

app.get('*', (req, res) => {
    res.send('<h1>404 Not Found</h1>')
})

server.listen(port, () => {
    console.log('Server listening on port ' + port)
})