import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import './index.scss';
import '../styles/globals.css';
import '../components/Navbar/Navbar.scss';
import '../pages/characters/characters.scss';
import '../components/MainTitle/MainTitle.scss';

import type { AppProps } from 'next/app';

export const client = new ApolloClient({
   uri: 'http://localhost:3000/api/graphql',
   cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
   return (
      <ApolloProvider client={client}>
         <Component {...pageProps} />
      </ApolloProvider>
   );
}
