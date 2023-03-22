import { useRouter } from 'next/router';
import Link from 'next/link';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../_app';
import { LocationsDataType, LocationsInfoType, LocationsType } from '../../types/LocationsType';
import MainTitle from '../../components/MainTitle/MainTitle';

interface Props {
   data: LocationsDataType;
}

export default function Episodes({ data }: Props) {
   const router = useRouter();
   const currentPage = router.query.page;
   const locationData = data.locations.results;
   const maxPage = data.locations.info.pages;

   return (
      <>
         <MainTitle content="Locations" />
         <div className="locations-page-container">
            <ul className="locations-list">
               {locationData.map((location: LocationsType) => (
                  <Link
                     href={{
                        pathname: '/locations/by-id/[id]',
                        query: { id: location.id },
                     }}
                     key={location.id}
                  >
                     <li>
                        {location.name} - ({location.dimension})
                     </li>
                  </Link>
               ))}
            </ul>
            <div className="buttons-container">
               <Link
                  href={`${Number(currentPage) > 1 && Number(currentPage) - 1}`}
                  style={{ pointerEvents: `${Number(currentPage) === 1 ? 'none' : 'auto'}` }}
               >
                  <div>PREV PAGE</div>
               </Link>
               <Link
                  href={`${Number(currentPage) + 1}`}
                  style={{ pointerEvents: `${Number(currentPage) === maxPage ? 'none' : 'auto'}` }}
               >
                  <div>NEXT PAGE</div>
               </Link>
            </div>
         </div>
      </>
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
