import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { tss } from '../../tss';

export const PokemonDetailModal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemonDetails(id!);
  const { classes } = useStyles();

  if (loading) return <div>Loading Pokémon details...</div>;
  if (error || !data) return <div>Error loading details.</div>;
  if (!id) return <div>Invalid Pokémon ID</div>;

  const handleClose = () => navigate(-1);

  return (
    <div className={classes.overlay} role="dialog" aria-modal="true">
      <button
        type="button"
        className={classes.overlayClickArea}
        onClick={handleClose}
        aria-label="Close Pokémon details"
      />
      <div className={classes.modal}>
        <button
          type="button"
          onClick={handleClose}
          className={classes.closeButton}
          aria-label="Close modal"
        >
          ×
        </button>

        <img src={data.sprite} alt={data.name} className={classes.image} />

        <h2 id="pokemon-modal-title" className={classes.name}>
          #{data.id} {data.name}
        </h2>

        <p>Height: {data.height}</p>
        <p>Weight: {data.weight}</p>
        <p>Capture Rate: {data.capture_rate}</p>

        <h3>Stats</h3>
        <ul>
          {data.stats?.map((s) => (
            <li key={s.name}>
              {s.name}: {s.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayClickArea: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    appearance: 'none',
  },
  modal: {
    position: 'relative',
    background: theme.color.surface[1],
    borderRadius: theme.radius.lg,
    padding: theme.spacing(4),
    width: '90%',
    maxWidth: 400,
    boxShadow: theme.shadow[3],
    textAlign: 'center',
    color: theme.color.text.primary,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    border: 'none',
    background: 'transparent',
    color: theme.color.text.primary,
    fontSize: '1.5rem',
    cursor: 'pointer',
    lineHeight: 1,
  },
  image: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },
  name: {
    margin: `${theme.spacing(2)} 0 ${theme.spacing(1)}`,
    textTransform: 'capitalize',
  },
}));
