import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../_app';
import { CharactersType, CharactersDataType } from '../../types/CharactersType';
import MainTitle from '../../components/MainTitle/MainTitle';

interface Props {
   data: CharactersDataType;
}

export default function Characters({ data }: Props) {
   const charactersList = data.characters.results;
   const maxPage = data.characters.info.pages;
   const router = useRouter();
   const pageNumber = router.query.page;

   return (
      <>
         <MainTitle content="Characters" />
         <div className="characters-page-container">
            <div className="character-cards-container">
               {charactersList.map((character: CharactersType) => (
                  <div className="character-card" key={character.id}>
                     <div className="img-container">
                        <img src={character.image} alt="Character portrait" />
                     </div>
                     <div className="character-details">
                        <Link
                           href={{
                              pathname: '/characters/by-id/[id]',
                              query: { id: `${character.id}` },
                           }}
                        >
                           <p className="character-name">{character.name}</p>
                           <div className="character-status">
                              <p>Status:</p>
                              <p>{character.status}</p>
                              <div className={`status-icon ${character.status}`}></div>
                           </div>
                           <div className="character-species">
                              <p>Species:</p>
                              <p>{character.species}</p>
                           </div>
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
            <div className="buttons-container">
               <Link
                  href={`${Number(pageNumber) > 1 && Number(pageNumber) - 1}`}
                  style={{
                     pointerEvents: `${Number(pageNumber) === 1 ? 'none' : 'auto'}`,
                     opacity: Number(pageNumber) === 1 ? 0.5 : 1,
                  }}
               >
                  <div>PREV PAGE</div>
               </Link>
               <Link
                  href={`${Number(pageNumber) + 1}`}
                  style={{
                     pointerEvents: `${Number(pageNumber) === maxPage ? 'none' : 'auto'}`,
                     opacity: Number(pageNumber) === maxPage ? 0.5 : 1,
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
   const currentPage = context.params.page;

   const GET_CHARACTERS = gql`
      query {
         characters(page: ${currentPage}) {
            info {
               count
               pages
               next
            }
            results {
               id
               name
               image
               status
               species
            }
         }
      }
   `;
   const { loading, error, data }: ApolloQueryResult<CharactersDataType> = await client.query({
      query: GET_CHARACTERS,
   });

   return {
      props: {
         data,
         loading,
      },
   };
}

export async function getStaticPaths() {
   const GET_NUMBER_OF_PAGES = gql`
      query {
         characters(page: 1) {
            info {
               pages
            }
         }
      }
   `;

   const { loading, error, data }: ApolloQueryResult<CharactersDataType> = await client.query({
      query: GET_NUMBER_OF_PAGES,
   });

   const numberOfPages = data.characters.info.pages;
   const pagesArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);

   const paths = pagesArray.map((page) => ({
      params: { page: page.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
