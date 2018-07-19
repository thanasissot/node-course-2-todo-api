const mongoose = require('mongoose');
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

const user = new User({
  email: 'Thanasis@example.com   '
});
//
// user.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (err) =>{
//   console.log(err);
// });

module.exports = {User};
