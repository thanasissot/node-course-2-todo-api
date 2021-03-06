require('./config/config');
const port  = process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectId} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');

const app = express();
// you tell express to use bodyparser to send a json object along with the request
app.use(bodyParser.json());

// CRUD create read update delete
//POST new Todo
app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) =>{
    res.send(doc);
    // console.log(JSON.stringify(doc, undefined, 3));
  }, (err) => {
    res.status(400).send(err);
  });
});

// GET all Todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({
      todos
    });
  }, (err) => {
    res.status(400).send(err);
  });
});

// GET one Todo by id
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send(
      todo
    )
  }, (err) => {
    res.status(400).send();
    console.log(err);
  });
});

// DELETE one todo
app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send(
      {todo}
    )
  }, (err) => {
    res.status(400).send();
  });
});

// UPDATE todo
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed', '_creator']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator : req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }, (err) => {
    return res.stats(404).send()
  });

});

// POST /users
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(
    body
  );
// to make password hidden i guess. really dont understand wtf tokens are
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }, (err) => {
    res.status(400).send(err);
  });
});

// private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }, (err) => {
    res.status(400).send(err)
  })
});

// private route
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log(`Serving up at port ${port}`);
})

module.exports = {app};
