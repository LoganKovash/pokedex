import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes, theme } = useStyles();
  const { data, loading, error } = useGetPokemons();
  const [searchTerm, setSearchTerm] = useState('');
  // const navigate = useNavigate();
  const location = useLocation();

  const skeletons = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  if (loading)
    return (
      <ul className={classes.list}>
        {skeletons.map((id) => (
          <li key={id} className={classes.skeletonCard}>
            <div className={classes.skeletonImage} />
            <div className={classes.skeletonText} />
          </li>
        ))}
      </ul>
    );

  if (error) return <div className={classes.status}>Error loading Pokémons!</div>;

  const filteredData = data.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.id.toString().includes(searchTerm),
  );

  return (
    <div className={classes.root}>
      <input
        type="text"
        placeholder="Search Pokémon by name or type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchBar}
      />

      {filteredData.length === 0 ? (
        <div className={classes.centerMessage}>No Pokémon found — try checking your search.</div>
      ) : (
        <ul className={classes.list}>
          {filteredData.map((pokemon) => (
            <li key={pokemon.id} className={classes.cardWrapper}>
              <Link
                to={`/list/pokemon/${pokemon.id}`}
                state={{ background: location }}
                className={classes.card}
              >
                <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
                <div className={classes.info}>
                  <h3 className={classes.name}>
                    #{pokemon.id} {pokemon.name}
                  </h3>
                  {pokemon.types && pokemon.types.length > 0 && (
                    <div className={classes.types}>
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={classes.typeBadge}
                          style={{
                            backgroundColor:
                              theme.pokemonTypeColors[type] || theme.color.surface[2],
                          }}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Outlet />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: theme.spacing(3),
  },
  searchBar: {
    width: '100%',
    maxWidth: 400,
    display: 'block',
    margin: `${theme.spacing(2)} auto`,
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.md,
    border: 'none',
    backgroundColor: theme.color.surface[1],
    color: theme.color.text.primary,
    fontSize: '1rem',
    boxShadow: theme.shadow[1],
    outline: 'none',
    transition: 'box-shadow 0.2s ease-in-out',
    '&::placeholder': {
      color: theme.color.text.secondary,
    },
    '&:focus': {
      boxShadow: theme.shadow[2],
    },
  },
  centerMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '1.25rem',
    color: theme.color.text.secondary,
    textAlign: 'center',
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: theme.spacing(3),
    listStyle: 'none',
    padding: 0,
  },
  cardWrapper: {
    listStyle: 'none',
  },
  card: {
    all: 'unset', // removes default button styles
    display: 'block',
    width: 150,
    background: theme.color.surface[1],
    borderRadius: theme.radius.md,
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow: theme.shadow[1],
    transition: 'transform 0.15s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadow[2],
    },
  },
  image: {
    width: 96,
    height: 96,
    objectFit: 'contain',
  },
  info: {
    marginTop: theme.spacing(1),
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    margin: 0,
  },
  types: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: theme.color.surface[2],
    borderRadius: theme.radius.sm,
    padding: '2px 6px',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
  },
  skeletonCard: {
    background: theme.color.surface[1],
    borderRadius: theme.radius.md,
    height: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: '$pulse 1.5s infinite',
  },
  skeletonImage: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.sm,
    background: '#333',
    marginBottom: theme.spacing(1),
  },
  skeletonText: {
    width: '60%',
    height: 16,
    borderRadius: theme.radius.sm,
    background: '#444',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.4 },
    '100%': { opacity: 1 },
  },
}));
