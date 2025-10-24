import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LayoutWrapper } from './LayoutWrapper';
import { HomePage } from './screens/HomePage';
import { PokemonListPage } from './screens/PokemonListPage';
import { PokemonDetailModal } from './screens/modals/PokemonDetailModal';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphql.pokeapi.co/v1beta2' }),
  cache: new InMemoryCache(),
});

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };

  return (
    <>
      <Routes location={state?.background || location}>
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<HomePage />} />
          <Route path="list" element={<PokemonListPage />}>
            <Route path="pokemon/:id" element={<PokemonDetailModal />} />
          </Route>
        </Route>
      </Routes>

      {state?.background && (
        <Routes>
          <Route path="/list/pokemon/:id" element={<PokemonDetailModal />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ApolloProvider>
);

export default App;
