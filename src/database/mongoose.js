const mongoose = require('mongoose')

// This will prevent deprecation warning re Server Discover and Monitoring engine
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})