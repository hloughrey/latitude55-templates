import { getBooks } from './books.service';

export default {
  BooksResult: {
    __resolveType(obj) {
      if (obj.code === 'BOOK_NOT_FOUND') return 'NotFoundError';
      return 'Book';
    }
  },
  Query: {
    books: getBooks
  }
};
