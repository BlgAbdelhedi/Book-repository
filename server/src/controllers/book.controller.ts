
import { getDB } from '../db';
import { Author } from '../models/author.model';
import { Book } from '../models/book.model';

export async function createBook(book: Book, authorIds: number[]): Promise<Book> {
  const db = getDB();

  const result = await db.run(
    `INSERT INTO books (title, isbn) VALUES (?, ?)`,
    [book.title, book.isbn]
  );
  const newBookId = result.lastID;

  for (const authorId of authorIds) {
    await db.run(
      `INSERT INTO book_authors (bookId, authorId) VALUES (?, ?)`,
      [newBookId, authorId]
    );
  }

  return { ...book, id: newBookId };
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const db = getDB();

  const bookRow = await db.get<Book>(`SELECT * FROM books WHERE id = ?`, [id]);
  if (!bookRow) {
    return undefined;
  }

  const authors = await db.all<Author[]>(
    `
    SELECT authors.* 
    FROM authors
    JOIN book_authors ON authors.id = book_authors.authorId
    WHERE book_authors.bookId = ?
    `,
    [id]
  );

  return { ...bookRow, authors };
}

export async function updateBook(
  id: number,
  updatedBook: Book,
  authorIds: number[]
): Promise<Book | undefined> {
  const db = getDB();

  await db.run(
    `UPDATE books SET title = ?, isbn = ? WHERE id = ?`,
    [updatedBook.title, updatedBook.isbn, id]
  );

  await db.run(`DELETE FROM book_authors WHERE bookId = ?`, [id]);

  for (const authorId of authorIds) {
    await db.run(
      `INSERT INTO book_authors (bookId, authorId) VALUES (?, ?)`,
      [id, authorId]
    );
  }

  return getBookById(id);
}

export async function deleteBook(id: number): Promise<boolean> {
  const db = getDB();
  await db.run(`DELETE FROM books WHERE id = ?`, [id]);
  return true;
}

export async function searchBooks(
  searchTerm?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Book[];
  total: number;
  page: number;
  pages: number;
}> {
  const db = getDB();
  const offset = (page - 1) * limit;
  let baseQuery = `
    SELECT DISTINCT books.* 
    FROM books
    LEFT JOIN book_authors ON books.id = book_authors.bookId
    LEFT JOIN authors ON authors.id = book_authors.authorId
  `;
  let countQuery = `
    SELECT COUNT(DISTINCT books.id) as count
    FROM books
    LEFT JOIN book_authors ON books.id = book_authors.bookId
    LEFT JOIN authors ON authors.id = book_authors.authorId
  `;

  const params: (string | number)[] = [];
  const countParams: (string | number)[] = [];

  if (searchTerm) {
    baseQuery += `
      WHERE books.title LIKE ? 
        OR books.isbn LIKE ? 
        OR authors.name LIKE ?
    `;
    countQuery += `
      WHERE books.title LIKE ?
         OR books.isbn LIKE ?
         OR authors.name LIKE ?
    `;
    params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
    countParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
  }

  baseQuery += ` LIMIT ${limit} OFFSET ${offset}`;

  const bookRows = await db.all<Book[]>(baseQuery, params);
  const countRow = await db.get<{ count: number }>(countQuery, countParams);
  const total = countRow?.count || 0;

  const data: Book[] = [];
  for (const book of bookRows) {
    const authors = await db.all<Author[]>(
      `SELECT authors.* 
       FROM authors
       JOIN book_authors ON authors.id = book_authors.authorId
       WHERE book_authors.bookId = ?`,
      [book.id]
    );
    data.push({ ...book, authors });
  }

  return {
    data,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}
