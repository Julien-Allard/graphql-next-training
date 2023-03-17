import { useRouter } from 'next/router';
import { ApolloQueryResult, gql } from '@apollo/client';

import { client } from '../../_app';
import { CharactersDataType, OneCharacterType } from '../../../types/CharactersType';

interface Props {
   data: {
      character: OneCharacterType;
   };
}

export default function CharacterById({ data }: Props) {
   const router = useRouter();
   return <div>{data.character.name}</div>;
}

interface Context {
   params: { id: string };
   locales: undefined;
   local: undefined;
   defaultLocale: undefined;
}

export async function getStaticProps(context: Context) {
   const characterId = context.params.id;

   const GET_CHARACTER_BY_ID = gql`
    query {
      character(id: ${characterId}) {
        id
        name
        status
        created
        species
        gender
        origin {
          name
        }
        location {
          name
          dimension
        }
        image
        episode
      }
    }
   `;

   const { loading, error, data }: ApolloQueryResult<OneCharacterType> = await client.query({
      query: GET_CHARACTER_BY_ID,
   });

   return {
      props: {
         data,
      },
   };
}

export async function getStaticPaths() {
   const GET_NUMBER_OF_CHARACTERS = gql`
      query {
         characters(page: 1) {
            info {
               count
            }
         }
      }
   `;

   const { loading, error, data }: ApolloQueryResult<CharactersDataType> = await client.query({
      query: GET_NUMBER_OF_CHARACTERS,
   });

   const numberOfCharacters = data.characters.info.count;
   const charactersArray = Array.from({ length: numberOfCharacters }, (_, i) => i + 1);

   const paths = charactersArray.map((character) => ({
      params: { id: character.toString() },
   }));

   return {
      paths,
      fallback: false,
   };
}
