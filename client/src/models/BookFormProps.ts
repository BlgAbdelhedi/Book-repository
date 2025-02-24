import { Author } from "./Author";

export interface BookFormProps {
  initialBook?: {
    id?: number;
    title: string;
    isbn: string;
    authors: Author[];
  };
  onSave: () => void;
  onError: (msg: string) => void;
  onCancel?: () => void;
}