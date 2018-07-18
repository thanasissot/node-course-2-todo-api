// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/TodoApp';

MongoClient.connect(url, { useNewUrlParser: true } ,(err, client) => {
  if (err) {
    return console.log('Error: ' + err);
  }

  console.log('Connected to MongoDb Server');
  const db = client.db('TodoApp');

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
  for (let i = 0; i < 2; i++) {
  db.collection('Todos').insertOne({
    text: 'New One',
    numerical: 20,
    completed: false
  }, (err, results) => {
    if (err) {
      console.log('Error Dude :' + err);
    }
    console.log(JSON.stringify(results, undefined, 2));
  });
  }

  client.close();

});
