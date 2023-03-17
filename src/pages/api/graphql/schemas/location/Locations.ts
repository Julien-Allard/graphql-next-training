import { gql } from 'graphql-tag';

import { Info } from '../Info';
import { Location } from './Location';

export const Locations = gql`
   ${Info}

   ${Location}

   type Locations {
      info: Info
      results: [Location]
   }
`;
