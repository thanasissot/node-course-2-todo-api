const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {MongoClient, ObjectId} = require('mongodb');

var id = '5b511a682bcf476b886648e4';

if (!ObjectId.isValid(id)) {
  console.log('ID not valid');
}
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.find({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('ID not found');
  }
  console.log('Todo by id', todo);
}).catch((e) => {
  console.log(e);
})

User.findById('5b50a5be3335fb3a9208e677').then((todo) => {
  if (!todo) {
    return console.log('Unable to find User');
  }
  console.log('Todo by id', todo);
}, (err) => {
  console.log(err);
})
