import React from 'react';
import { Box, TextField } from '@mui/material';
import { STRINGS } from '../constants/string.const';
import { BookInputsProps } from '../models/BookInputProps';

function BookInputs({ title, setTitle, isbn, setIsbn }: BookInputsProps) {
  return (
      <><TextField
      className="book-form__field"
      label={STRINGS.title}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required /><TextField
        className="book-form__field"
        label={STRINGS.isbn}
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        required /></>
  );
}

export default BookInputs;
