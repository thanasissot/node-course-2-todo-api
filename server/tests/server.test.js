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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    let id = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .get(`/todos/123abc`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
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

  it('should not remove a todo created by other user', (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(id).then((todo) => {
        expect(todo).toBeDefined();
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
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id is invalid', (done) => {
    let id = 'randomString'
    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo1', (done) => {
    let id = todos[0]._id
    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
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

  it('should update the todo2', (done) => {
    let id = todos[1]._id
    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
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

  it('should not update the todo created by other user', (done) => {
    let id = todos[1]._id
    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text: 'this is changed',
      completed: true
    })
    .expect(404)
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
      }, (err) => {
        return done(err);
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
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeDefined();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }, (err) => {
        return done(err);
      });
    });
  });


  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      passwod: 'wrongPassword'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeUndefined();
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }, (err) => {
        return done(err);
      });
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    });
  });
});
