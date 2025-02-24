import { initDB } from '../../db';
import { Author } from '../../models/author.model';
import { createAuthor } from '../../controllers/author.controller';
import { Book } from '../../models/book.model';
import {
  createBook,
  deleteBook,
  getBookById,
  searchBooks,
  updateBook
} from '../../controllers/book.controller';

describe('Book Controller (Unit)', () => {
  let author: Author;
  let bookId: number;

  beforeAll(async () => {
    await initDB();
    author = await createAuthor('Test Author');
  });

  it('should create a book', async () => {
    const newBook: Book = { title: 'Test Book', isbn: 'TEST-ISBN' };
    const result = await createBook(newBook, [author.id!]);
    expect(result.id).toBeDefined();
    bookId = result.id!;
  });

  it('should get book by id', async () => {
    const book = await getBookById(bookId);
    expect(book).toBeDefined();
    expect(book?.title).toBe('Test Book');
    expect(book?.authors?.[0].name).toBe('Test Author');
  });

  it('should update the book', async () => {
    const updated = await updateBook(bookId, { title: 'Updated Title', isbn: 'NEW-ISBN' }, [author.id!]);
    expect(updated?.title).toBe('Updated Title');
  });

  it('should search books', async () => {
    const searchResult = await searchBooks('Updated');
    expect(searchResult.data.length).toBeGreaterThan(0);
  });

  it('should delete the book', async () => {
    await deleteBook(bookId);
    const deleted = await getBookById(bookId);
    expect(deleted).toBeUndefined();
  });
});
