const expect = require('expect');
const request = require('supertest');

const {app} = require('./../app');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    let id = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .get(`/todos/123abc`)
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(id)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(id).then((todo) => {
        expect(todo).toBeNull();
        done();
      }, (err) => {
        return done(err)
      });
    });
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectId().toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id is invalid', (done) => {
    let id = 'randomString'
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let id = todos[0]._id
    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'this is changed',
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe('this is changed');
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeTruthy();
    })
    .end(done);
  });

  it('should update the todo', (done) => {
    let id = todos[1]._id
    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = '123abc!';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeDefined();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        return done(err)
      }

      User.findOne({email}).then((user) => {
        expect(user).toBeDefined();
        expect(user.password).not.toBe(password);
        done();
      })
    });
  });


  it('should return validation errors if request invalid', (done) => {
    let email = 'IamNOTanEMAIL';
    let password = 'short';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    let newUser = users[0];
    request(app)
    .post('/users')
    .send(newUser)
    .expect(400)
    .end(done)
  });
})
