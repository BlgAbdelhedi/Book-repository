import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBookById,
  searchBooks,
  updateBook
} from '../controllers/book.controller';

export const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { title, isbn, authors } = req.body;
    if (!title || !isbn) {
      return res.status(400).json({ error: 'Title and ISBN are required' });
    }
    const result = await createBook({ title, isbn }, authors || []);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    const results = await searchBooks(search as string, pageNum, limitNum);
    return res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json(book);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, isbn, authors } = req.body;
    const updated = await updateBook(id, { title, isbn }, authors || []);
    if (!updated) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await deleteBook(id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
