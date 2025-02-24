import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { api } from '../services/api';
import { Author, ExtendedAuthor } from '../models/Author';
import { STRINGS } from '../constants/string.const';
import '../styles/bookForm.scss';
import { BookFormProps } from '../models/BookFormProps';

const filter = createFilterOptions<ExtendedAuthor>();

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

  const handleAuthorsChange = useCallback(async (
    event: React.SyntheticEvent,
    newValue: ExtendedAuthor[]
  ) => {
    const newItemIndex = newValue.findIndex((item) => item.isNew);
    if (newItemIndex !== -1) {
      const displayName = newValue[newItemIndex].name;
      const match = displayName.match(/^Create\sAuthor\s+"(.+)"$/);
      const actualName = match ? match[1] : displayName;
      try {
        const res = await api.post('/authors', { name: actualName });
        const createdAuthor: Author = res.data;
        newValue[newItemIndex] = createdAuthor;
        setAuthorList((prev) => [...prev, createdAuthor]);
      } catch (err: any) {
        onError(err.response?.data?.error || '');
        newValue.splice(newItemIndex, 1);
      }
    }
    setSelectedAuthors(newValue);
  }, [onError]);

  return (
    <Box className="book-form">
      <form onSubmit={handleSubmit}>
        <Box className="book-form__row">
          <TextField
            className="book-form__field"
            label={STRINGS.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            className="book-form__field"
            label={STRINGS.isbn}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
          <Autocomplete
            multiple
            className="book-form__field"
            options={authorList as ExtendedAuthor[]}
            value={selectedAuthors as ExtendedAuthor[]}
            onChange={handleAuthorsChange}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (opt) => opt.name.toLowerCase() === inputValue.toLowerCase()
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  id: -1,
                  name: `Create Author "${inputValue}"`,
                  isNew: true
                });
              }
              return filtered;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={STRINGS.authors}
                placeholder={STRINGS.selectOrType}
              />
            )}
            sx={{ minWidth: 300 }}
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
