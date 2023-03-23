import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../../_app';
import { LocationsInfoType, LocationsType } from '../../../types/LocationsType';
import MainTitle from '../../../components/MainTitle/MainTitle';

interface Props {
   data: {
      location: LocationsType;
   };
}

export default function LocationById({ data }: Props) {
   const locationData = data.location;
   return (
      <>
         <MainTitle content={locationData.name} />
         <div className="unique-location-container">
            <ul className="location-card">
               <li>
                  <p>Name :</p>
                  <p>Type :</p>
                  <p>Dimension :</p>
               </li>
               <li>
                  <p>{locationData.name}</p>
                  <p>{locationData.type}</p>
                  <p>{locationData.dimension}</p>
               </li>
            </ul>
         </div>
      </>
   );
}

interface Context {
   params: { id: string };
   locales: undefined;
   local: undefined;
   defaultLocale: undefined;
}

export async function getStaticProps(context: Context) {
   const locationId = context.params.id;

   const GET_LOCATION_BY_ID = gql`
      query {
         location(id: ${locationId}) {
            id
            name
            type
            dimension
         }
      }
   `;

   type LocationData = {
      location: LocationsType;
   };

   const { loading, error, data }: ApolloQueryResult<LocationData> = await client.query({
      query: GET_LOCATION_BY_ID,
   });

   return {
      props: {
         data,
      },
   };
}

export async function getStaticPaths() {
   const GET_ALL_LOCATIONS_ID = gql`
      query {
         locations(page: 1) {
            info {
               count
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
      query: GET_ALL_LOCATIONS_ID,
   });

   const numberOfLocations = data.locations.info.count;
   const locationsArray = Array.from({ length: numberOfLocations }, (_, i) => i + 1);

   const paths = locationsArray.map((location) => ({
      params: { id: location.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
