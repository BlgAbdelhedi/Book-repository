import React, { useCallback } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Author, ExtendedAuthor } from '../models/Author';
import { STRINGS } from '../constants/string.const';
import { AuthorsAutocompleteProps } from '../models/AuthorsAutocompleteProps';

const filter = createFilterOptions<ExtendedAuthor>();

function AuthorsAutocomplete({
  authorList,
  setAuthorList,
  selectedAuthors,
  setSelectedAuthors,
  onError
}: AuthorsAutocompleteProps) {
  const handleAuthorsChange = useCallback(
    async (event: React.SyntheticEvent, newValue: ExtendedAuthor[]) => {
      const newItemIndex = newValue.findIndex((item) => item.isNew);
      if (newItemIndex !== -1) {
        const displayName = newValue[newItemIndex].name;
        const match = displayName.match(/^Create\sAuthor\s+"(.+)"$/);
        const actualName = match ? match[1] : displayName;
        try {
          const res = await (await import('../services/api')).api.post('/authors', { name: actualName });
          const createdAuthor: Author = res.data;
          newValue[newItemIndex] = createdAuthor;
          setAuthorList((prev) => [...prev, createdAuthor]);
        } catch (err: any) {
          onError(err.response?.data?.error || '');
          newValue.splice(newItemIndex, 1);
        }
      }
      setSelectedAuthors(newValue);
    },
    [setAuthorList, setSelectedAuthors, onError]
  );

  return (
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
  );
}

export default AuthorsAutocomplete;
