const express = require('express')
const path = require('path')

require('./database/mongoose')

const appointmentRouter = require('./routers/appointmentRouter')
const companyRouter = require('./routers/companyRouter')
const encounterRouter = require('./routers/encounterRouter')
const emailRouter = require('./routers/emailRouter')
const personRouter = require('./routers/personRouter')
const positionRouter = require('./routers/positionRouter')
const attachmentRouter = require('./routers/attachmentRouter')
const loginRouter = require('./routers/loginRouter')

const app = express()
const port = process.env.PORT || 5000

// Set up static directory to serve the client code
const public = path.join(__dirname, '../client/build')
app.use(express.static(public))

// Translate request body from JSON
app.use(express.json({type: [
    'text/plain',           // Used by all messages from SNS
    'application/json'      // For future use
]}))

app.use('/contactlite', appointmentRouter)
app.use('/contactlite', companyRouter)
app.use('/contactlite', encounterRouter)
app.use('/contactlite', emailRouter)
app.use('/contactlite', personRouter)
app.use('/contactlite', positionRouter)
app.use('/contactlite', attachmentRouter)
app.use('/contactlite', loginRouter)

app.get('*', (req, res) => {
    res.send('<h1>404 Not Found</h1>')
})

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})