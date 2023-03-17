import { gql } from 'graphql-tag';

import { Info } from '../Info';
import { Character } from './Character';

export const Characters = gql`
   # Info schema you can find on all general requests (characters, locations and episodes)
   ${Info}

   ${Character}

   type Characters {
      info: Info
      results: [Character]
   }
`;
