
import { getDB } from '../db';
import { Author } from '../models/author.model';

export async function createAuthor(name: string): Promise<Author> {
  const db = getDB();
  const result = await db.run(`INSERT INTO authors (name) VALUES (?)`, [name]);
  return { id: result.lastID, name };
}

export async function getAuthorById(id: number): Promise<Author | undefined> {
  const db = getDB();
  const row = await db.get<Author>(`SELECT * FROM authors WHERE id = ?`, [id]);
  return row;
}

export async function updateAuthor(id: number, newName: string): Promise<Author | undefined> {
  const db = getDB();
  await db.run(`UPDATE authors SET name = ? WHERE id = ?`, [newName, id]);
  return getAuthorById(id);
}

export async function deleteAuthor(id: number): Promise<boolean> {
  const db = getDB();
  await db.run(`DELETE FROM authors WHERE id = ?`, [id]);
  return true;
}

export async function listAuthors(): Promise<Author[]> {
  const db = getDB();
  const rows = await db.all<Author[]>(`SELECT * FROM authors`);
  return rows;
}
