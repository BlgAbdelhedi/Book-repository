import request from 'supertest';
import { initDB } from '../../db';
import { app } from '../../app';

describe('Author Routes (Integration)', () => {
  let authorId: number;

  beforeAll(async () => {
    await initDB();
  });

  it('should return 400 when creating author with no name', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });

  it('should create a new author', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({ name: 'Test Author' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Test Author');

    authorId = response.body.id;
  });

  it('should list all authors', async () => {
    const response = await request(app).get('/api/authors');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const found = response.body.find((a: any) => a.id === authorId);
    expect(found).toBeDefined();
    expect(found.name).toBe('Test Author');
  });

  it('should get the author by ID', async () => {
    const response = await request(app).get(`/api/authors/${authorId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(authorId);
    expect(response.body.name).toBe('Test Author');
  });

  it('should update the author name', async () => {
    const response = await request(app)
      .put(`/api/authors/${authorId}`)
      .send({ name: 'Updated Author Name' });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(authorId);
    expect(response.body.name).toBe('Updated Author Name');
  });

  it('should return 404 for a non-existing author', async () => {
    const response = await request(app).get('/api/authors/99999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Author not found');
  });

  it('should delete the author', async () => {
    const response = await request(app).delete(`/api/authors/${authorId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return 404 after author is deleted', async () => {
    const response = await request(app).get(`/api/authors/${authorId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Author not found');
  });
});
