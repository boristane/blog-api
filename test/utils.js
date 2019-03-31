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
      if(!response.body.user) console.log(response.body);
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

async function loginAndDeleteAllUsers(email, password) {
  const token = await login(email, password);
  const response = await supertest(server)
      .get('/users/')
      .set('Authorization', `Bearer ${token}`);
  const users = response.body.users;
  if(users){
    users.forEach(async (user) => {
      const userId = user._id;
      await deleteUser(userId, token);
    });
  }
}

async function postProject(token) {
  const title = 'project test';
  const url = 'https://boristane.com/test';
  const github = 'https://github.com/boristane/test';
  const description ='<p>Test Projects Description</p>';
  const stack = 'JavaScript, Go, Python';
  const imagePath = `${__dirname}/files/test.png`;
  let response = await supertest(server)
    .post('/projects/')
    .set('Accept', 'application.json')
    .set('Authorization', `Bearer ${token}`)
    .attach('image', imagePath)
    .field('title', title)
    .field('url', url)
    .field('github', github)
    .field('description', description)
    .field('stack', stack);
  return response;
}

async function deleteProject(projectId, token) {
  let response = await supertest(server)
    .delete(`/projects/${projectId}`)
    .set('Authorization', `Bearer ${token}`);
  return response;
}

export {
  signup,
  login,
  deleteUser,
  loginAndDeleteAllUsers,
  postProject,
  deleteProject,
};
