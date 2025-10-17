import React from 'react';
import { act, userEventRender, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({
    data: [
      { id: '1', name: 'Bulbasaur' },
      { id: '2', name: 'Ivysaur' },
      { id: '3', name: 'Charmander' },
    ],
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  test('it renders', () => {
    const { getByText } = userEventRender(<PokemonListPage />);
    getByText('#1 Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('#1 Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('/list/pokemon/1'),
      expect.any(Object),
    );
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
