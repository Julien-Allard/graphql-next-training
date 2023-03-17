import { gql } from 'graphql-tag';

export const Info = gql`
   type Info {
      count: Int
      pages: Int
      next: String
      prev: String
   }
`;
