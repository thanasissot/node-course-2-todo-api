const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedPw = '$2a$10$kF7pUA2Ju8Lz9wi4LpDh8u7j5ifdVB81ORTgrE5.PTaVFxltpmwxK';

bcrypt.compare(password, hashedPw, (err, res) => {
  console.log(res);
});






// let message = 'I am user number 3';
// let hash = SHA256(message).toString();
//
// console.log(message);
// console.log('='.repeat(hash.length));
// console.log(hash);
//
// let data = {
//   id: 4
// };
//
// let token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed. dont trust');
// }
// THE ABOVE COMMENTS ARE NOT TO BE USED TO APPS (PLAYING AROUND ONLY)

//
// let data = {
//   id: 10
// };
// let token = jwt.sign(data, '123abc');
// console.log(token);
//
// let decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);
