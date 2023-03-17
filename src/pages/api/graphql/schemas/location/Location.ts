import { gql } from 'graphql-tag';

export const Location = gql`
   type Location {
      id: ID
      name: String
      type: String
      dimension: String
      residents: [String]
      url: String
      created: String
   }
`;
