import { gql } from 'graphql-tag';

export const Character = gql`
   type Origin {
      name: String
      url: String
   }

   type Location {
      name: String
      url: String
   }

   type Character {
      id: ID
      name: String
      status: String
      species: String
      type: String
      gender: String
      origin: Origin
      location: Location
      image: String
      episode: [String]
      url: String
      created: String
   }
`;
