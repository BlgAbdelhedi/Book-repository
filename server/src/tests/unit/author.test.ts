import { initDB } from '../../db';
import {
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  listAuthors
} from '../../controllers/author.controller';
import { Author } from '../../models/author.model';

describe('Author Controller (Unit)', () => {
  let createdAuthor: Author;

  beforeAll(async () => {
    await initDB();
  });

  it('should create an author', async () => {
    createdAuthor = await createAuthor('George Orwell');
    expect(createdAuthor.id).toBeDefined();
    expect(createdAuthor.name).toBe('George Orwell');
  });

  it('should retrieve the author by ID', async () => {
    const fetched = await getAuthorById(createdAuthor.id!);
    expect(fetched).toBeDefined();
    expect(fetched?.name).toBe('George Orwell');
  });

  it('should update the author name', async () => {
    const updated = await updateAuthor(createdAuthor.id!, 'Orwell G.');
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Orwell G.');
  });

  it('should list authors and find our updated author', async () => {
    const authors = await listAuthors();
    const found = authors.find(a => a.id === createdAuthor.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe('Orwell G.');
  });

  it('should delete the author', async () => {
    const result = await deleteAuthor(createdAuthor.id!);
    expect(result).toBe(true);

    const deleted = await getAuthorById(createdAuthor.id!);
    expect(deleted).toBeUndefined();
  });
});
