/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-extraneous-dependencies */

import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphql-pokeapi.graphcdn.app/' }),
  cache: new InMemoryCache(),
});

const BaseProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const ProvidersWithRouter: FC<{ children: React.ReactNode }> = ({ children }) => (
  <BaseProviders>
    <MemoryRouter>{children}</MemoryRouter>
  </BaseProviders>
);

// for most component tests (adds router)
const renderWithRouter = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: ProvidersWithRouter, ...options });

// use this if the component (like <App />) already includes a router
const renderApp = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: BaseProviders, ...options });

const userEventRender = (jsx: ReactElement, options?: RenderOptions) => {
  const wrapper = renderWithRouter(jsx, options);
  return {
    user: userEvent.setup({ delay: null }),
    ...wrapper,
  };
};

export * from '@testing-library/react';
export { userEventRender as render, renderApp, userEventRender };
