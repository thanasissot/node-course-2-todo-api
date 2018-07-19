const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
// you tell express to use bodyparser to send a json object along with the request
app.use(bodyParser.json());

// CRUD create read update delete
app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) =>{
    res.send(doc);
    console.log(JSON.stringify(doc, undefined, 3));
  }, (err) => {
    res.status(400).send(err);
  });
  
});


app.listen(3000, () => {
  console.log('Serving on port 3000');
})
