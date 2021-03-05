const mongoose = require('mongoose')

// This will prevent deprecation warning re Server Discover and Monitoring engine
mongoose.set('useUnifiedTopology', true);


const accessKeyId = encodeURIComponent("AKIA4BYFC2EVYW4QNUOX");
const secretAccessKey = encodeURIComponent("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");
const clusterUrl = "cluster0.vpqlb.mongodb.net/test";
const authMechanism = "MONGODB-AWS";
const authSource = "$external"
const connectionUrl = `mongodb+srv://${accessKeyId}:${secretAccessKey}@${clusterUrl}`

console.log('Connecting to ' + connectionUrl)
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    authMechanism,
    authSource
})

// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })