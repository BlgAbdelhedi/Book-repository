import { Author } from './author.model';

export interface Book {
  id?: number;
  title: string;
  isbn: string;
  authors?: Author[];
}