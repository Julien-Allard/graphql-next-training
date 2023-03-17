import { gql } from 'graphql-tag';

export const Query = gql`
   type Query {
      character(id: ID!): Character
      characters(page: ID!): Characters
      location(id: ID!): Location
      locations(page: ID!): Locations
      episode(id: ID!): Episode
      episodes(page: ID!): Episodes
   }
`;
