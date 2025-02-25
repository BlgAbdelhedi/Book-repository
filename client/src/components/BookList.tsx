import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  TextField,
  Backdrop,
  IconButton,
  Snackbar,
  Fade,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { api } from '../services/api';
import { STRINGS } from '../constants/string.const';
import BookForm from './BookForm';
import { Author } from '../models/Author';
import { Book } from '../models/Book';
import '../styles/bookList.scss';
import { BookResponse } from '../models/BookResponse';
import { PaperComponent } from './PaperComponent';


function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const fetchBooks = useCallback(async (pageNum: number, searchTerm: string) => {
    const start = performance.now();
    try {
      const res = await api.get<BookResponse>('/books', {
        params: { page: pageNum, limit: 10, search: searchTerm }
      });
      setBooks(res.data.data);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch { }
    finally {
      const elapsed = performance.now() - start;
      const remaining = 500 - elapsed;
      if (remaining > 0) {
        setTimeout(() => setIsLoadingInitial(false), remaining);
      } else {
        setIsLoadingInitial(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBooks(page, search);
  }, [page, search, fetchBooks]);

  const handleCreateSuccess = useCallback(() => {
    setIsActionLoading(false);
    setShowCreateForm(false);
    fetchBooks(page, search);
    showSnackbar(STRINGS.createdBookFeedback);
  }, [page, search, fetchBooks, showSnackbar]);

  const handleUpdateSuccess = useCallback(() => {
    setIsActionLoading(false);
    setEditingBookId(null);
    fetchBooks(page, search);
    showSnackbar(STRINGS.updatedBookFeedback);
  }, [page, search, fetchBooks, showSnackbar]);

  const handleOpenDeleteDialog = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleteDialogOpen(false);
    await handleDelete(bookToDelete.id!);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleDelete = useCallback(async (id: number) => {
    setIsActionLoading(true);
    const start = performance.now();
    try {
      await api.delete(`/books/${id}`);
      showSnackbar(STRINGS.deletedBookFeedback);
    } catch { }
    finally {
      const elapsed = performance.now() - start;
      const remaining = 500 - elapsed;
      setTimeout(() => {
        setIsActionLoading(false);
        fetchBooks(page, search);
      }, remaining > 0 ? remaining : 0);
    }
  }, [page, search, fetchBooks, showSnackbar]);

  return (
    <Box className="book-list">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={isLoadingInitial}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!isLoadingInitial && (
        <>
          <Box className="book-list__search">
            <TextField
              className="book-list__field"
              fullWidth
              label={STRINGS.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                endAdornment: search ? (
                  <IconButton
                    aria-label="clear search"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                ) : null
              }}
            />
          </Box>

          {!showCreateForm && (
            <Box className="book-list__create-button-row">
              <Button
                variant="contained"
                onClick={() => setShowCreateForm(true)}
              >
                {STRINGS.createNewBook}
              </Button>
            </Box>
          )}

          {showCreateForm && (
            <Box>
              {isActionLoading ? (
                <Box className="book-list__processing">
                  <CircularProgress size={24} />
                  <span>{STRINGS.processing}</span>
                </Box>
              ) : (
                <BookForm
                  onSave={handleCreateSuccess}
                  onError={(msg: string) => {
                    setIsActionLoading(false);
                    console.error(msg);
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </Box>
          )}

          <TableContainer component={Paper} className="book-list__table-container">
            <Table className="book-list__table">
              <TableHead>
                <TableRow>
                  <TableCell>{STRINGS.title}</TableCell>
                  <TableCell>{STRINGS.isbn}</TableCell>
                  <TableCell>{STRINGS.authors}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TransitionGroup component={TableBody}>
                {books.map((b) => {
                  const isEditing = editingBookId === b.id;

                  if (isEditing) {
                    return (
                      <CSSTransition
                        key={b.id}
                        timeout={300}
                        classNames="book-list__fade"
                      >
                        <TableRow>
                          <TableCell colSpan={4}>
                            {isActionLoading ? (
                              <Box className="book-list__processing">
                                <CircularProgress size={24} />
                                <span>{STRINGS.processing}</span>
                              </Box>
                            ) : (
                              <BookForm
                                initialBook={b}
                                onSave={handleUpdateSuccess}
                                onError={(msg: string) => {
                                  setIsActionLoading(false);
                                  console.error(msg);
                                }}
                                onCancel={() => setEditingBookId(null)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      </CSSTransition>
                    );
                  }

                  return (
                    <CSSTransition
                      key={b.id}
                      timeout={300}
                      classNames="book-list__fade"
                    >
                      <TableRow>
                        <TableCell>{b.title}</TableCell>
                        <TableCell>{b.isbn}</TableCell>
                        <TableCell>
                          {b.authors?.map((a: Author) => a.name).join(', ')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={() => setEditingBookId(b.id)}
                          >
                            {STRINGS.edit}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(b)}
                          >
                            {STRINGS.delete}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </Table>
          </TableContainer>

          <Box className="book-list__pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'contained' : 'outlined'}
                onClick={() => setPage(p)}
                style={{ marginRight: '0.5rem' }}
              >
                {p}
              </Button>
            ))}
          </Box>
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: 'move' }}
          className="draggable-dialog-title"
          id="draggable-dialog-title"
        >
          {STRINGS.confirmDeletion}
        </DialogTitle>
        <DialogContent dividers>
          {STRINGS.deletionCheck} "{bookToDelete?.title}" ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            {STRINGS.cancel}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            {STRINGS.confirm}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        TransitionComponent={Fade}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default React.memo(BookList);
