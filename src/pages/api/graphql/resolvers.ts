import { get } from '../utils/get';

export const resolvers = {
   Query: {
      character: (_: any, { id }: { id: number }) => get('character', 'id', id),
      characters: (_: any, { page }: { page: number }) => get('character', 'page', page),
      location: (_: any, { id }: { id: number }) => get('location', 'id', id),
      locations: (_: any, { page }: { page: number }) => get('location', 'page', page),
      episode: (_: any, { id }: { id: number }) => get('episode', 'id', id),
      episodes: (_: any, { page }: { page: number }) => get('episode', 'page', page),
   },
};
