import { useRouter } from 'next/router';
import { ApolloQueryResult, gql } from '@apollo/client';
import Link from 'next/link';

import { client } from '../../_app';
import { CharactersDataType, OneCharacterType } from '../../../types/CharactersType';
import { EpisodesInfoType } from '../../../types/EpisodesType';
import MainTitle from '../../../components/MainTitle/MainTitle';

interface Props {
   data: {
      character: OneCharacterType;
      episodes: {
         info: EpisodesInfoType;
      };
   };
}

export default function CharacterById({ data }: Props) {
   const totalEpisodes = data.episodes.info.count;
   const episodesArray = Array.from({ length: totalEpisodes }, (_, elem) => elem + 1);
   const featuredEpisodes = data.character.episode.map((feature) => feature.split('/').at(-1));

   return (
      <>
         <MainTitle content={data.character.name} />
         <div className="unique-character-container">
            <div className="character-data">
               <div className="data-details">
                  <div className="portrait-container">
                     <img src={data.character.image} alt={`${data.character.name} portrait`} />
                  </div>
                  <div className="all-details">
                     <div>
                        <p>Name:</p>
                        <p>Species:</p>
                        <p>Gender:</p>
                        <p>Status:</p>
                        <p>Origin:</p>
                        <p>Current location:</p>
                     </div>
                     <div>
                        <p>{data.character.name}</p>
                        <p>{data.character.species}</p>
                        <p>{data.character.gender}</p>
                        <p>
                           {data.character.status}
                           <span className={data.character.status}></span>
                        </p>
                        <p>{data.character.origin.name}</p>
                        <p>{data.character.location.name}</p>
                     </div>
                  </div>
               </div>
               <div className="featured-episodes">
                  <h2>Featured Episodes ({data.character.episode.length})</h2>
                  <ul>
                     {episodesArray.map((episode, index) => {
                        return (
                           <Link href={`/episodes/by-id/${episode}`} key={index}>
                              <li
                                 className={`${
                                    featuredEpisodes.includes(episode.toString()) ? 'featured' : ''
                                 }`}
                              >
                                 Episode {episode}
                              </li>
                           </Link>
                        );
                     })}
                  </ul>
               </div>
            </div>
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
         episodes(page: 1) {
            info {
               count
            }
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
