export interface Author {
  id: number;
  name: string;
}

export interface ExtendedAuthor extends Author {
  isNew?: boolean;
}

