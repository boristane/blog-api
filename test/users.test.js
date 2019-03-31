import supertest from 'supertest';
import mongoose from 'mongoose';
const server = require('../server');
import {signup,
  login,
  deleteUser,
  loginAndDeleteAllUsers,
} from './utils';

const username = 'surprise';
const email = 'suprise@surprise.com';
const password = 'motherfucker';

// close the server after each test
afterAll(async () => {
  await loginAndDeleteAllUsers(email, password);
  server.close();
});

// close the server before each test
beforeAll(async () => {
  await loginAndDeleteAllUsers(email, password);
  server.close();
});

describe('/users route testing', () => {
  test('POST for signup on new user', async () => {
    const response = await supertest(server)
      .post('/users/signup')
      .send({
        username,
        email,
        password,
      })
      .set('Accept', 'application/json');
    const userId = response.body.user._id;
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully.');
    expect(response.body.user.email).toBe(email);

    const token = await login(email, password);
    await deleteUser(userId, token);
  });

  test('POST for signup on existing user', async () => {
    const userId = await signup(username, email, password);

    const response = await supertest(server)
      .post('/users/signup')
      .send({
        email,
        password,
      })
      .set('Accept', 'application/json');
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User already created.');

    const token = await login(email, password);
    await deleteUser(userId, token);
  });

  test('DELETE existing user', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);

    const response = await supertest(server)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted.');
  });

  test('POST login with valid input', async () => {
    const userId = await signup(username, email, password);

    const response = await supertest(server)
      .post('/users/login')
      .send({
        email,
        password,
      })
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication Successful.');
    expect(response.body.token).toBeTruthy();
    const token = response.body.token;

    await deleteUser(userId, token);
  });

  test('POST login with invalid input', async () => {
    const response = await supertest(server)
      .post('/users/login')
      .send({
        username: 'a',
        email: 'a',
        password: 'a',
      })
      .set('Accept', 'application/json');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication Failed.');
    expect(response.body.token).toBeFalsy();
  });

  test('GET all users', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);

    const response = await supertest(server)
      .get('/users/')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.count).toBeGreaterThanOrEqual(0);

    await deleteUser(userId, token);
  });

  test('GET one existing user', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);

    const response = await supertest(server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.request.type).toBe('GET');

    await deleteUser(userId, token);
  });

  test('GET one invalid user', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);

    const fakeUserId = mongoose.Types.ObjectId();
    const response = await supertest(server)
      .get(`/users/${fakeUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No valid user found.');

    await deleteUser(userId, token);
  });
});
