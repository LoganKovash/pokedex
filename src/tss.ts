import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: ['#000E1C', '#001A33', '#00284D'],
      text: {
        primary: '#FAFAFA',
        secondary: '#C9D1D9',
      },
    },
    spacing: (factor: number) => `${factor * 8}px`,
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    shadow: {
      0: 'none',
      1: '0 2px 6px rgba(0, 0, 0, 0.25)',
      2: '0 4px 12px rgba(0, 0, 0, 0.35)',
    },
    pokemonTypeColors: {
      Normal: '#A8A77A',
      Fire: '#EE8130',
      Water: '#6390F0',
      Electric: '#F7D02C',
      Grass: '#7AC74C',
      Ice: '#96D9D6',
      Fighting: '#C22E28',
      Poison: '#A33EA1',
      Ground: '#E2BF65',
      Flying: '#A98FF3',
      Psychic: '#F95587',
      Bug: '#A6B91A',
      Rock: '#B6A136',
      Ghost: '#735797',
      Dragon: '#6F35FC',
      Dark: '#705746',
      Steel: '#B7B7CE',
      Fairy: '#D685AD',
    } as Record<string, string>,
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

export const useStyles = tss.create(({ theme }) => ({
  rootLayout: {
    backgroundColor: theme.color.surface[0],
    color: theme.color.text.primary,
  },
}));
