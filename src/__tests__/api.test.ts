import request from 'supertest';
import { server } from '../index';

let userId: string;

describe('GET /users', () => {
  it('should return a list of users', async () => {
    const res = await request(server).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /users - should create a new user', async () => {
    const res = await request(server)
      .post('/users')
      .send({ username: 'Martin Alekseevich', age: 30, hobbies: ['eat'] });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('GET /users/{userId} - should return the created user', async () => {
    const res = await request(server).get(`/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  it('PUT /users/{userId} - should update the user', async () => {
    const res = await request(server)
      .put(`/users/${userId}`)
      .send({ username: 'Martin Alekseevich', age: 25, hobbies: ['read'] });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'Martin Alekseevich');
  });

  it('DELETE /users/{userId} - should delete the user', async () => {
    const res = await request(server).delete(`/users/${userId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('GET /users/{userId} - should return 404 for deleted user', async () => {
    const res = await request(server).get(`/users/${userId}`);
    expect(res.statusCode).toEqual(404);
  });

});