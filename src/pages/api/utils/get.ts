import fetch from 'node-fetch';

/*
   this function will adapt the target url based on 3 parameters :
   - endpoint,
   - type (is it a page or just an id ?),
   - number: representng either the targeted page or id based on the type selected,
   and return requested data.

   Examples : 
      get('character', 'page', 2) will target https://rickandmortyapi.com/api/character/?page=2
      get('location', 'id', 34) will target https://rickandmortyapi.com/api/location/34
*/

export const get = async (
   endpoint: 'character' | 'location' | 'episode',
   type: 'page' | 'id',
   number: number,
) => {
   const response = await fetch(
      `https://rickandmortyapi.com/api/${endpoint}/${type === 'page' ? '?page=' : ''}${number}`,
   );
   const data = await response.json();

   return data;
};
