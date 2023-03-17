import { useRouter } from 'next/router';
import Link from 'next/link';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../_app';
import { LocationsDataType, LocationsInfoType, LocationsType } from '../../types/LocationsType';

interface Props {
   data: LocationsDataType;
}

export default function Episodes({ data }: Props) {
   const router = useRouter();
   const currentPage = router.query.page;
   const locationData = data.locations.results;
   const maxPage = data.locations.info.pages;

   return (
      <div>
         {locationData.map((location: LocationsType) => (
            <Link
               href={{
                  pathname: '/locations/by-id/[id]',
                  query: { id: location.id },
               }}
               key={location.id}
            >
               <p>{location.name}</p>
            </Link>
         ))}
         <Link
            href={`${Number(currentPage) > 1 && Number(currentPage) - 1}`}
            style={{ pointerEvents: `${Number(currentPage) === 1 ? 'none' : 'auto'}` }}
         >
            <button type="button">PREV PAGE</button>
         </Link>
         <Link
            href={`${Number(currentPage) + 1}`}
            style={{ pointerEvents: `${Number(currentPage) === maxPage ? 'none' : 'auto'}` }}
         >
            <button type="button">NEXT PAGE</button>
         </Link>
      </div>
   );
}

interface Context {
   params: { page: string };
   locales: undefined;
   local: undefined;
   defaultLocale: undefined;
}

export async function getStaticProps(context: Context) {
   const currentPage = context.params.page;

   const GET_LOCATIONS_BY_PAGE = gql`
    query {
      locations(page: ${currentPage}) {
        info {
            count
            pages
            next
        }
        results {
            id
            name
            dimension
        }
      }
    }
  `;

   const { loading, error, data }: ApolloQueryResult<LocationsDataType> = await client.query({
      query: GET_LOCATIONS_BY_PAGE,
   });

   return {
      props: {
         data,
      },
   };
}

export async function getStaticPaths() {
   const GET_NUMBER_OF_PAGES = gql`
      query {
         locations(page: 1) {
            info {
               pages
            }
         }
      }
   `;

   type InfoType = {
      locations: {
         info: LocationsInfoType;
      };
   };

   const { loading, error, data }: ApolloQueryResult<InfoType> = await client.query({
      query: GET_NUMBER_OF_PAGES,
   });

   const numberOfPages = data.locations.info.pages;
   const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);

   const paths = pagesArray.map((page) => ({
      params: { page: page.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
