export type CharactersType = {
   id: string;
   name: string;
   image: string;
   status: string;
   species: string;
};

export type OneCharacterType = {
   id: number;
   name: string;
   status: string;
   created: string;
   species: string;
   gender: string;
   origin: {
      name: string;
   };
   location: {
      name: string;
      dimension: string;
   };
   image: string;
   episode: string;
};

export type CharactersInfoType = {
   __typename: string;
   count: number;
   pages: number;
   next: string;
};

export type CharactersDataType = {
   characters: {
      __typename: string;
      info: CharactersInfoType;
      results: CharactersType[];
   };
};
