import request from 'supertest';
import { server } from '../index';

describe('GET', () => {
  it('GET /api/users – should return a list of users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
  });

  it('GET /api/users/{userId} - should return the created user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    const responseGet = await request(server).get(`/api/users/${userId}`);
    expect(responseGet.statusCode).toEqual(200);
    expect(responseGet.body).toHaveProperty('user');
  });

  it('GET /api/users/{userId} - should return 404 for deleted user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    await request(server).delete(`/api/users/${userId}`);
    const responseGet = await request(server).get(`/api/users/${userId}`);
    expect(responseGet.statusCode).toEqual(404);
  });
});

describe('POST', () => {
  it('POST /api/users - should create a new user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const res = await request(server).post('/api/users').send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id');
  });

  it('POST /api/users - should return 400 for invalid user data', async () => {
    const user = { username: 'Martin Alekseevich', age: 30 };
    const res = await request(server).post('/api/users').send(user);
    expect(res.statusCode).toEqual(400);
  });

  it('POST /api/users - should create a user and return user data', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const res = await request(server).post('/api/users').send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username', user.username);
  });
});

describe('PUT', () => {
  it('PUT /api/users/{userId} - should update the user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    const responsePut = await request(server).put(`/api/users/${userId}`).send({ username: 'Martin' });
    expect(responsePut.statusCode).toEqual(200);
  });

  it('PUT /api/users/{userId} - should return 400 for invalid user data', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    const responsePut = await request(server).put(`/api/users/${userId}`).send({ username: 123 });
    expect(responsePut.statusCode).toEqual(400);
  });

  it('PUT /api/users/{userId} - should return 404 if user not found', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    await request(server).delete(`/api/users/${userId}`);
    const responsePut = await request(server).put(`/api/users/${userId}`).send({ username: 'Martin' });
    expect(responsePut.statusCode).toEqual(404);
  });
});

describe('DELETE', () => {
  it('DELETE /api/users/{userId} - should return 400 for invalid user data', async () => {
    const response = await request(server).delete('/api/users/invalid-id');
    expect(response.statusCode).toEqual(400);
  });

  it('DELETE /api/users/{userId} - should delete the user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    const responseDelete = await request(server).delete(`/api/users/${userId}`);
    expect(responseDelete.statusCode).toEqual(204);
  });

  it('DELETE /api/users/{userId} - should return 404 for deleted user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/api/users').send(user);
    const userId = responsePost.body.user.id;
    await request(server).delete(`/api/users/${userId}`);
    const responseDeleteAgain = await request(server).delete(`/api/users/${userId}`);
    expect(responseDeleteAgain.statusCode).toEqual(404);
  });
});
