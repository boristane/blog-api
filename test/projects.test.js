import supertest from 'supertest';
const server = require('../server');
import {signup,
  login,
  deleteUser,
  loginAndDeleteAllUsers,
  postProject,
  deleteProject,
} from './utils';

// close the server after each test
afterAll(async () => {
  await loginAndDeleteAllUsers(email, password);
  server.close();
});

beforeAll(async () => {
  await loginAndDeleteAllUsers(email, password);
  server.close();
});

const username = 'project';
const email = 'project@surprise.com';
const password = 'motherfucker';

describe('/projects route testing', () => {
  test('GET all projects', async () => {
    const numProjects = 5;
    const userId = await signup(username, email, password);
    const token = await login(email, password);
    const postResponses = [];
    for (let i = 0; i < numProjects; i += 1) {
      const res = await postProject(token);
      postResponses.push(res);
    }
    const projectields = ['_id', 'title', 'url', 'github', 'description', 'image', 'stack', 'createdAt', 'updatedAt'];
    const response = await supertest(server)
      .get('/projects/');
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(numProjects);
    response.body.projects.forEach(elt => {
      projectields.forEach((field) => {
        expect(elt).toHaveProperty(field);
      });
      expect(typeof elt.title).toBe('string');
      expect(typeof elt.url).toBe('string');
      expect(Array.isArray(elt.stack)).toBeTruthy();
    });
    for (let i = 0; i < numProjects; i += 1) {
      await deleteProject(postResponses[i].body.project._id, token);
    }
    await deleteUser(userId, token);
  });

  test('POST a project', async () => {
    const projectFields = ['_id', 'title', 'url', 'github', 'description', 'image', 'stack', 'createdAt', 'updatedAt'];
    const userId = await signup(username, email, password);
    const token = await login(email, password);
    const response = await postProject(token);
    expect(response.status).toBe(200);
    projectFields.forEach((field) => {
      expect(response.body.project).toHaveProperty(field);
    });
    await deleteProject(response.body.project._id, token);
    await deleteUser(userId, token);
  });

  test('DELETE a project', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);
    const postResponse = await postProject(token);
    const response = await deleteProject(postResponse.body.project._id, token);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Project deleted.');
    await deleteUser(userId, token);
  });

  test('GET one valid projects', async () => {
    const userId = await signup(username, email, password);
    const token = await login(email, password);
    const postResponse = await postProject(token);
    const project = postResponse.body.project;
    const projectields = ['_id', 'title', 'url', 'github', 'description', 'image', 'stack', 'createdAt', 'updatedAt'];
    const response = await supertest(server)
      .get(`/projects/${project._id}`);
    expect(response.status).toBe(200);
    projectields.forEach((field) => {
      expect(project).toHaveProperty(field);
    });
    expect(typeof project.title).toBe('string');
    expect(typeof project.url).toBe('string');
    expect(Array.isArray(project.stack)).toBeTruthy();
    await deleteProject(project._id, token);
    await deleteUser(userId, token);
  });
});
