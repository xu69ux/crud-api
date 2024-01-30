import request from 'supertest';
import { server } from '../index';

describe('GET /users', () => {
  it('should return a list of users', async () => {
    const res = await request(server).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /users/{userId} - should return the created user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/users').send(user);
    const userId = responsePost.body.id;
    const responseGet = await request(server).get(`/users/${userId}`);
    expect(responseGet.statusCode).toEqual(200);
    expect(responseGet.body).toHaveProperty('id', userId);
  });

  it('GET /users/{userId} - should return 404 for deleted user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/users').send(user);
    const userId = responsePost.body.id;
    await request(server).delete(`/users/${userId}`);
    const responseGet = await request(server).get(`/users/${userId}`);
    expect(responseGet.statusCode).toEqual(404);
  });
});

describe('POST /users', () => {
  it('POST /users - should create a new user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const res = await request(server).post('/users').send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('POST /users - should return 400 for invalid user data', async () => {
    const user = { username: 'Martin Alekseevich', age: 30 };
    const res = await request(server).post('/users').send(user);
    expect(res.statusCode).toEqual(400);
  });
});

describe('PUT /users/{userId}', () => {
  it('PUT /users/{userId} - should update the user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/users').send(user);
    const userId = responsePost.body.id;
    const responsePut = await request(server).put(`/users/${userId}`).send({ username: 'Martin' });
    expect(responsePut.statusCode).toEqual(200);
  });
});

describe('DELETE /users/{userId}', () => {
  it('DELETE /users/{userId} - should return 400 for invalid user data', async () => {
    const response = await request(server).delete('/users/invalid-id');
    expect(response.statusCode).toEqual(400);
  });

  it('DELETE /users/{userId} - should delete the user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/users').send(user);
    const userId = responsePost.body.id;
    const responseDelete = await request(server).delete(`/users/${userId}`);
    expect(responseDelete.statusCode).toEqual(204);
  });

  it('DELETE /users/{userId} - should return 404 for deleted user', async () => {
    const user = { username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] };
    const responsePost = await request(server).post('/users').send(user);
    const userId = responsePost.body.id;
    await request(server).delete(`/users/${userId}`);
    const responseDeleteAgain = await request(server).delete(`/users/${userId}`);
    expect(responseDeleteAgain.statusCode).toEqual(404);
  });
});
