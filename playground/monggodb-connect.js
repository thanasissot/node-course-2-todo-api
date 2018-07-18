// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/TodoApp';

MongoClient.connect(url, { useNewUrlParser: true } ,(err, client) => {
  if (err) {
    return console.log('Error: ' + err);
  }

  console.log('Connected to MongoDb Server');
  const db = client.db('TodoApp');

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: $sud{count}`);
    // console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Error: '+err);
  });

  client.close();

});


// create collection find from collection do stuff to collection
// db.collection('NewCollection').insertOne({
//   name: 'Me',
//   nickname: 'Whatever',
//   age: 26
// }, (err, results) => {
//   if (err) {
//     console.log('Error Dude :' + err);
//   }
//   console.log(JSON.stringify(results.ops[0]._id.getTimestamp()));
// });
// and more of the same
// db.collection('Todos').insertOne({
//   text: 'Hellos',
//   completed: false
// }, (err, results) => {
//   if (err) {
//     console.log('Error Dude :' + err);
//   }
//   console.log(JSON.stringify(results.ops[0]._id.getTimestamp()));
// });


// FIND ALL or ONE or MORE with find({ })
// db.collection('Todos').find().toArray().then((docs) => {
//   console.log('Todos');
//   console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('Error: '+err);
// });


// find with ObjectID like _id : new ObjectID(_idSTRING)
// db.collection('Todos').find({
//   _id: new ObjectID('5b4e3c457026207467f623fd')
// }).toArray().then((docs) => {
//   console.log('Todos');
//   console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('Error: '+err);
// });
