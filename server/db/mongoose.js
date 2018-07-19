const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/TodoApp';

// Tell mongoose to use the build in Promise(JS vanilla)
mongoose.Promise = global.Promise;
// connect to the mongo database
mongoose.connect(url, { useNewUrlParser: true })
// create a mongoose model

module.exports = {mongoose};
