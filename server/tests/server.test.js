const expect = require('expect');
const request = require('supertest');

const {app} = require('./../app');

const {Todo}  = require('./../models/todo');

describe('POST /todos', () => {

  test('It should response with the POST method', (done) => {
    text = 'This is a test';
    request(app)
      .post('/todos')
      .send({text})
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.text).toBe(text);
        done();
      }, (e) => {
           console.log(e);
        })
  });

  test('It should response with the Error', (done) => {
    text = '';
    request(app)
      .post('/todos')
      .send({text})
      .then((res) => {
        expect(res.statusCode).toBe(400);
        done();
      }, (e) => {
           console.log(e);
        })
  });

});
