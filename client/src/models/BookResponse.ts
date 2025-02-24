import { Book } from "./Book";

export interface BookResponse {
  data: Book[];
  total: number;
  page: number;
  pages: number;
}