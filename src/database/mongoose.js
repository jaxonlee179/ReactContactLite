const mongoose = require('mongoose')

/**
 * Configures Mongoose for MongoDB access
 */
mongoose.set('useUnifiedTopology', true);

const user = encodeURIComponent(process.env.CL_MONGODB_USER);
const clusterUrl = process.env.CL_MONGODB_PATH;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}

let connectionUrl;
if (user === 'undefined'){
    // Use IAM authentication
    const accessKeyId = encodeURIComponent(process.env.CL_MONGODB_KEY_ID);
    const secretAccessKey = encodeURIComponent(process.env.CL_MONGODB_ACCESS_KEY);
    options.authMechanism = "MONGODB-AWS";
    options.authSource = "$external"
    connectionUrl = `mongodb+srv://${accessKeyId}:${secretAccessKey}@${clusterUrl}`
    console.log(`Connecting to ${clusterUrl} using IAM authentication`)
}
else {
    // Connect using name/password
    const password = encodeURIComponent(process.env.CL_MONGODB_PASSWORD);
    connectionUrl = `mongodb+srv://${user}:${password}@${clusterUrl}`;    
    console.log(`Connecting to ${clusterUrl} with username/password`)
}    
    
console.log('Connecting to ' + clusterUrl)

try {
    mongoose.connect(connectionUrl, options);
    console.log("Connected to database")
}
catch (error){
    console.log("Cannot connect:" + error)
}

