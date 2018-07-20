const mongoose = require('mongoose');

// Tell mongoose to use the build in Promise(JS vanilla)
mongoose.Promise = global.Promise;
// connect to the mongo database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
// create a mongoose model

module.exports = {mongoose};
