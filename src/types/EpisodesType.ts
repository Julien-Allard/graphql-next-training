export type EpisodesType = {
   id: string;
   episode: string;
   name: string;
   air_date: string;
};

export type EpisodesInfoType = {
   __typename: string;
   count: number;
   pages: number;
   next: string;
};

export type EpisodesDataType = {
   info: EpisodesInfoType;
   results: EpisodesType[];
};
