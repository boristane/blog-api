const supertest = require('supertest');
const server = require('../server');

// close the server after each test
afterAll(() => {
  server.close();
});

// close the server before each test
beforeAll(() => {
  server.close();
})

describe('/users route testing', () => {
  test('POST with valid input', async () => {
    const response = await supertest(server)
      .post('/users/login')
      .send({
        email: process.env.VALID_TEST_EMAIL,
        password: process.env.VALID_TEST_PASSWORD,
      })
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication Successful.');
    expect(response.body.token).toBeTruthy();
  });
  test('POST with invalid input', async () => {
    const response = await supertest(server)
      .post('/users/login')
      .send({
        email: process.env.INVALID_TEST_EMAIL,
        password: process.env.INVALID_TEST_PASSWORD,
      })
      .set('Accept', 'application/json');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication Failed.');
    expect(response.body.token).toBeFalsy();
  });
});
