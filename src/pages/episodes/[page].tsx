import { useRouter } from 'next/router';
import Link from 'next/link';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../_app';
import { EpisodesInfoType, EpisodesType, EpisodesDataType } from '../../types/EpisodesType';
import MainTitle from '../../components/MainTitle/MainTitle';

interface Props {
   data: {
      episodes: EpisodesDataType;
   };
}

export default function Episodes(props: Props) {
   const router = useRouter();
   const currentPage = router.query.page;
   const episodesByPage = props.data.episodes.results;
   const maxPage = props.data.episodes.info.pages;

   return (
      <>
         <MainTitle content="Episodes" />
         <div className="episodes-page-container">
            <ul className="episodes-list">
               {episodesByPage.map((episode: EpisodesType) => (
                  <Link
                     key={episode.id}
                     href={{
                        pathname: '/episodes/by-id/[id]',
                        query: { id: `${episode.id}` },
                     }}
                  >
                     <li>
                        <p>{episode.episode}</p> - <p>{episode.name}</p>
                     </li>
                  </Link>
               ))}
            </ul>
            <div className="buttons-container">
               <Link
                  href={`${Number(currentPage) > 1 && Number(currentPage) - 1}`}
                  style={{
                     pointerEvents: `${Number(currentPage) === 1 ? 'none' : 'auto'}`,
                     opacity: Number(currentPage) === 1 ? 0.5 : 1,
                  }}
               >
                  <div>PREV PAGE</div>
               </Link>
               <Link
                  href={`${Number(currentPage) + 1}`}
                  style={{
                     pointerEvents: `${Number(currentPage) === maxPage ? 'none' : 'auto'}`,
                     opacity: Number(currentPage) === maxPage ? 0.5 : 1,
                  }}
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
   const pageNumber = context.params.page;

   const GET_EPISODES_BY_PAGE = gql`
      query {
         episodes(page: ${pageNumber}) {
            info {
               count
               pages
               next
            }
            results {
               id
               episode
               name
            }
         }
      }
   `;

   const { loading, error, data }: ApolloQueryResult<EpisodesDataType> = await client.query({
      query: GET_EPISODES_BY_PAGE,
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
         episodes(page: 1) {
            info {
               pages
            }
         }
      }
   `;

   type InfoType = {
      episodes: {
         info: EpisodesInfoType;
      };
   };

   const { loading, error, data }: ApolloQueryResult<InfoType> = await client.query({
      query: GET_NUMBER_OF_PAGES,
   });

   const numberOfPages = data.episodes.info.pages;
   const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);
   const paths = pagesArray.map((page) => ({
      params: { page: page.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
