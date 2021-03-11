const mongoose = require('mongoose')

// This will prevent deprecation warning re Server Discover and Monitoring engine
mongoose.set('useUnifiedTopology', true);

const accessKeyId = encodeURIComponent(process.env.KEY_ID);
const secretAccessKey = encodeURIComponent(process.env.ACCESS_KEY);
const clusterUrl = "cluster0.vpqlb.mongodb.net/test";

const connectionUrl = `mongodb+srv://${accessKeyId}:${secretAccessKey}@${clusterUrl}`

const authMechanism = "MONGODB-AWS";
const authSource = "$external"

console.log('Connecting to ' + connectionUrl)

try {
    mongoose.connect(connectionUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        authMechanism,
        authSource
    })
    console.log("Connected to database")
}
catch (error){
    console.log("Mongo connection:" + error)
}

