const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {MongoClient, ObjectId} = require('mongodb');

var id = '5b511a682bcf476b886648e4';

// remove everything

Todo.remove({}).then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
})

// find one and remove
Todo.findOneAndRemove({
  _id: 'someID'
}).then((todo) => {
  console.log(todo);
}, (err) => {
  console.log(err);
})
// Todo.findOneAndRemove({})
// Todo.findByIdAndRemove({_id: 'someID'})
