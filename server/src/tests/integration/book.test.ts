import request from 'supertest';
import { app } from '../../app';
import { initDB } from '../../db';

describe('Book API (Integration)', () => {
  let createdBookId: number;
  let createdAuthorId: number;

  beforeAll(async () => {
    await initDB();
  });

  it('should create an author', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({ name: 'John Steinbeck' });
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    createdAuthorId = response.body.id;
  });

  it('should create a book with an author', async () => {
    const response = await request(app)
      .post('/api/books')
      .send({
        title: 'The Grapes of Wrath',
        isbn: 'ISBN-1234',
        authors: [createdAuthorId]
      });
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    createdBookId = response.body.id;
  });

  it('should list books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should get the book by ID', async () => {
    const response = await request(app).get(`/api/books/${createdBookId}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('The Grapes of Wrath');
  });

  it('should update the book', async () => {
    const response = await request(app)
      .put(`/api/books/${createdBookId}`)
      .send({
        title: 'East of Eden',
        isbn: 'ISBN-5678',
        authors: [createdAuthorId]
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('East of Eden');
  });

  it('should delete the book', async () => {
    const response = await request(app).delete(`/api/books/${createdBookId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
