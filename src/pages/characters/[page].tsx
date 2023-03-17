import { useRouter } from 'next/router';
import Link from 'next/link';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../_app';
import { CharactersType, CharactersDataType } from '../../types/CharactersType';

interface Props {
   data: CharactersDataType;
}

export default function Characters({ data }: Props) {
   const charactersList = data.characters.results;
   const maxPage = data.characters.info.pages;
   const router = useRouter();
   const pageNumber = router.query.page;

   return (
      <div className="characters-page-container">
         <div className="character-cards-container">
            {charactersList.map((character: CharactersType) => (
               <Link
                  href={{
                     pathname: '/characters/by-id/[id]',
                     query: { id: `${character.id}` },
                  }}
                  key={character.id}
               >
                  <div className="character-card">
                     <p>{character.name}</p>
                     {/* <img src={character.image} alt="Character portrait" /> */}
                  </div>
               </Link>
            ))}
         </div>
         <Link
            href={`${Number(pageNumber) > 1 && Number(pageNumber) - 1}`}
            style={{ pointerEvents: `${Number(pageNumber) === 1 ? 'none' : 'auto'}` }}
         >
            <button type="button">PREV PAGE</button>
         </Link>
         <Link
            href={`${Number(pageNumber) + 1}`}
            style={{ pointerEvents: `${Number(pageNumber) === maxPage ? 'none' : 'auto'}` }}
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
