import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import { Author } from '../models/Author';
import { STRINGS } from '../constants/string.const';
import '../styles/bookForm.scss';
import { BookFormProps } from '../models/BookFormProps';
import BookInputs from './BookInputs';
import AuthorsAutocomplete from './AuthorsAutocomplete';

function BookForm({
  initialBook,
  onSave,
  onError,
  onCancel
}: BookFormProps) {
  const [title, setTitle] = useState(initialBook?.title || '');
  const [isbn, setIsbn] = useState(initialBook?.isbn || '');
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>(
    initialBook?.authors || []
  );
  const [authorList, setAuthorList] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAuthors = useCallback(async () => {
    try {
      const res = await api.get('/authors');
      setAuthorList(res.data);
    } catch (err: any) {
      onError(err.response?.data?.error || '');
    }
  }, [onError]);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const authorIds = selectedAuthors.map((auth) => auth.id);
      if (initialBook?.id) {
        await api.put(`/books/${initialBook.id}`, {
          title,
          isbn,
          authors: authorIds
        });
      } else {
        await api.post('/books', {
          title,
          isbn,
          authors: authorIds
        });
      }
      setIsSubmitting(false);
      onSave();
    } catch (error: any) {
      setIsSubmitting(false);
      onError(error.response?.data?.error || '');
    }
  }, [selectedAuthors, title, isbn, initialBook, onSave, onError]);

  return (
    <Box className="book-form">
      <form onSubmit={handleSubmit}>
        <Box className="book-form__row">
          <BookInputs
            title={title}
            setTitle={setTitle}
            isbn={isbn}
            setIsbn={setIsbn}
          />
          <AuthorsAutocomplete
            authorList={authorList}
            setAuthorList={setAuthorList}
            selectedAuthors={selectedAuthors}
            setSelectedAuthors={setSelectedAuthors}
            onError={onError}
          />
        </Box>
        <Box className="book-form__button-row">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {STRINGS.saving}
              </>
            ) : initialBook?.id ? STRINGS.updateBook : STRINGS.createBook}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={onCancel}
            >
              {STRINGS.cancel}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default React.memo(BookForm);
