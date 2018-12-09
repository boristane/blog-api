import supertest from 'supertest';
const server = require('../server');

async function signup(username, email, password) {
  let response = await supertest(server)
      .post('/users/signup')
      .send({
        username,
        email,
        password,
      })
      .set('Accept', 'application/json');
  return response.body.user._id;
}

async function login(email, password) {
  let response = await supertest(server)
    .post('/users/login')
    .send({
      email,
      password,
    })
    .set('Accept', 'application/json');
    return response.body.token;
}

async function deleteUser(userId, token) {
  let response = await supertest(server)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);
}

export { signup, login, deleteUser };