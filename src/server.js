const express = require('express')
const path = require('path')

require('./database/mongoose')

const appointmentRouter = require('./routers/appointmentRouter')
const companyRouter = require('./routers/companyRouter')
const contactRouter = require('./routers/contactRouter')
const emailRouter = require('./routers/emailRouter')
const personRouter = require('./routers/personRouter')
const positionRouter = require('./routers/positionRouter')

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

app.use(appointmentRouter)
app.use(companyRouter)
app.use(contactRouter)
app.use(emailRouter)
app.use(personRouter)
app.use(positionRouter)

app.get('*', (req, res) => {
    res.send('<h1>404 Not Found</h1>')
})

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})