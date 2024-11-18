import { gql } from 'apollo-server-express';

export default gql`
  #graphql
  union BooksResult = Book | NotFoundError

  type Book {
    id: Int!
    title: String
    author: String
  }

  type NotFoundError {
    message: String!
  }

  type Query {
    books(ids: [Int]): [BooksResult!]
  }
`;
