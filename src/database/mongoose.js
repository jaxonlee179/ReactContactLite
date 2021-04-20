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

const accessKeyId = encodeURIComponent(process.env.CL_MONGODB_KEY_ID);
const secretAccessKey = encodeURIComponent(process.env.CL_MONGODB_ACCESS_KEY);
const clusterUrl = process.env.CL_MONGODB_PATH;
const connectionUrl = `mongodb+srv://${accessKeyId}:${secretAccessKey}@${clusterUrl}`
    
options.authMechanism = "MONGODB-AWS";
options.authSource = "$external"
    
console.log('Connecting to ' + clusterUrl)

try {
    mongoose.connect(connectionUrl, options);
    console.log("Connected to database")
}
catch (error){
    console.log("Cannot connect:" + error)
}

