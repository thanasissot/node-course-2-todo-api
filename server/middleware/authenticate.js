const {User} = require('./../models/user');

// MIDDLEWARE
const authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user  = user;
    req.token = token;
    next();
  }, (err) => {
    res.status(401).send(err);
  });
}

module.exports = {authenticate};
