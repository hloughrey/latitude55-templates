const books = [
  {
    id: 1,
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    id: 2,
    title: 'City of Glass',
    author: 'Paul Auster'
  }
];

export function getBooks(_, { ids }, context) {
  const booksResult = [];
  for (const id of ids) {
    const book = books.find((book) => book.id === id);
    if (book) {
      booksResult.push(book);
    } else {
      booksResult.push({ message: 'Book not found', code: 'BOOK_NOT_FOUND' });
    }
  }
  return booksResult;
}
