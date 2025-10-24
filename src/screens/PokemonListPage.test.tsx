import React from 'react';
import { act, userEventRender, renderApp } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({
    data: [
      { id: '1', name: 'Bulbasaur' },
      { id: '2', name: 'Ivysaur' },
      { id: '3', name: 'Charmander' },
    ],
  }),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('it renders', () => {
    const { getByText } = userEventRender(<PokemonListPage />);
    expect(getByText('#1 Bulbasaur')).toBeInTheDocument();
  });

  test('clicking on a pokemon calls navigate', async () => {
    const { getByText } = userEventRender(<PokemonListPage />);

    const bulbasaurLink = getByText('#1 Bulbasaur').closest('a');
    expect(bulbasaurLink).toHaveAttribute('href', '/list/pokemon/1');
  });
  test('typing in the search bar filters the results', async () => {
    const { getByPlaceholderText, queryByText, user } = userEventRender(<PokemonListPage />);

    const searchInput = getByPlaceholderText(/search/i);

    // Type "Charmander" into the search input
    await act(async () => {
      await user.type(searchInput, 'Charmander');
    });

    // Check that Charmander is visible
    expect(queryByText('#3 Charmander')).toBeInTheDocument();

    // Check that other Pokémon are not visible
    expect(queryByText('#1 Bulbasaur')).not.toBeInTheDocument();
    expect(queryByText('#2 Ivysaur')).not.toBeInTheDocument();
  });
});
