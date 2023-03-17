import { gql } from 'graphql-tag';

export const Episode = gql`
   type Episode {
      id: ID
      name: String
      air_date: String
      episode: String
      characters: [String]
      url: String
      created: String
   }
`;
