import { gql } from 'graphql-tag';

import { Info } from '../Info';
import { Episode } from './Episode';

export const Episodes = gql`
   ${Info}

   ${Episode}

   type Episodes {
      info: Info
      results: [Episode]
   }
`;
