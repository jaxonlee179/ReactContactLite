const mongoose = require('mongoose')

/**
 * Configures Mongoose for MongoDB access
 */
mongoose.set('useUnifiedTopology', true);

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}
let connectionUrl;

if (process.env.KEY_ID){
    // Running in AWS . DB is in Atlas (cloud) 
    const accessKeyId = encodeURIComponent(process.env.KEY_ID);
    const secretAccessKey = encodeURIComponent(process.env.ACCESS_KEY);
    const clusterUrl = "cluster0.vpqlb.mongodb.net/test";
    
    connectionUrl = `mongodb+srv://${accessKeyId}:${secretAccessKey}@${clusterUrl}`
    
    options.authMechanism = "MONGODB-AWS";
    options.authSource = "$external"
    
    console.log('Connecting to ' + clusterUrl)
}
else {
    // Running in local enviroenment
    connectionUrl = process.env.MONGODB_URL
    console.log('Connecting to ' + connectionUrl)
}

try {
    mongoose.connect(connectionUrl, options);
    console.log("Connected to database")
}
catch (error){
    console.log("Mongo connection:" + error)
}

