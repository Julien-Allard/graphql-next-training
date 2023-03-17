import { useRouter } from 'next/router';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../../_app';
import { EpisodesInfoType, EpisodesType } from '../../../types/EpisodesType';

interface Props {
   data: {
      episode: EpisodesType;
   };
}

export default function EpisodeById({ data }: Props) {
   const router = useRouter();
   const episodeid = router.query.id;
   const episodeData = data.episode;

   return <div>{episodeData.name}</div>;
}

interface Context {
   params: { id: string };
   locales: undefined;
   local: undefined;
   defaultLocale: undefined;
}

export async function getStaticProps(context: Context) {
   const episodeId = context.params.id;

   const GET_EPISODE_BY_ID = gql`
    query {
      episode(id: ${episodeId}) {
        id
        episode
        name
        air_date
     }
    }
  `;

   interface EpisodeData {
      episode: EpisodesType;
   }

   const { loading, error, data }: ApolloQueryResult<EpisodeData> = await client.query({
      query: GET_EPISODE_BY_ID,
   });

   return {
      props: {
         data,
      },
   };
}

export async function getStaticPaths() {
   const GET_EPISODES_IDS = gql`
      query {
         episodes(page: 1) {
            info {
               count
            }
         }
      }
   `;

   type InfosType = {
      episodes: {
         info: EpisodesInfoType;
      };
   };

   const { loading, error, data }: ApolloQueryResult<InfosType> = await client.query({
      query: GET_EPISODES_IDS,
   });

   const numberOfEpisodes = data.episodes.info.count;
   const episodesArray = Array.from({ length: numberOfEpisodes }, (_, i) => i + 1);

   const paths = episodesArray.map((episode) => ({
      params: { id: episode.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
