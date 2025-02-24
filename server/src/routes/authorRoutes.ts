import { Router } from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  listAuthors,
  updateAuthor
} from '../controllers/author.controller';

export const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const author = await createAuthor(name);
    return res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const authors = await listAuthors();
    return res.json(authors);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const author = await getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    return res.json(author);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const updated = await updateAuthor(id, name);
    if (!updated) {
      return res.status(404).json({ error: 'Author not found' });
    }
    return res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await deleteAuthor(id);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
