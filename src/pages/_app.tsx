import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import './index.scss';
import '../styles/globals.css';
import '../components/Navbar/Navbar.scss';
import '../components/MainTitle/MainTitle.scss';
import '../pages/characters/characters.scss';
import '../pages/characters/by-id/characterbyid.scss';
import '../pages/episodes/episodes.scss';
import '../pages/episodes/by-id/episodebyid.scss';
import '../pages/locations/locations.scss';
import '../pages/locations/by-id/locationbyid.scss';

import type { AppProps } from 'next/app';

export const client = new ApolloClient({
   uri: 'https://graphql-next-training.vercel.app/api/graphql',
   cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
   return (
      <ApolloProvider client={client}>
         <Component {...pageProps} />
      </ApolloProvider>
   );
}
