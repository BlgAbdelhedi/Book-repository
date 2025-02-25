import { Author } from "./Author";

export interface AuthorsAutocompleteProps {
    authorList: Author[];
    setAuthorList: React.Dispatch<React.SetStateAction<Author[]>>;
    selectedAuthors: Author[];
    setSelectedAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
    onError: (msg: string) => void;
  }