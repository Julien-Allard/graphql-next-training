export type LocationsType = {
   id: string;
   name: string;
   type: string;
   dimension: string;
};

export type LocationsInfoType = {
   __typename: string;
   count: number;
   pages: number;
   next: string;
};

export type LocationsDataType = {
   locations: {
      info: LocationsInfoType;
      results: LocationsType[];
   };
};
