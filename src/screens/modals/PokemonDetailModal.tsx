import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { tss } from '../../tss';

export const PokemonDetailModal = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error } = useGetPokemonDetails(numericId);
  const { classes } = useStyles();

  if (loading) return <div>Loading Pokémon details...</div>;
  if (error || !data) return <div>Error loading details.</div>;
  if (!id) return <div>Invalid Pokémon ID</div>;

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1); // overlay case
    } else {
      navigate('/list'); // direct link case
    }
  };

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

        <h2 className={classes.name}>
          #{data.id} {data.name}
        </h2>

        <p className={classes.infoText}>Height: {data.height}</p>
        <p className={classes.infoText}>Weight: {data.weight}</p>
        <p className={classes.infoText}>Capture Rate: {data.capture_rate}</p>

        <h3>Stats</h3>
        <div className={classes.statsContainer}>
          {data.stats?.map((s) => (
            <div key={s.name} className={classes.statItem}>
              {s.name}: {s.base_stat}
            </div>
          ))}
        </div>
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
    backdropFilter: 'blur(4px)',
  },
  overlayClickArea: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    appearance: 'none',
  },
  modal: {
    position: 'relative',
    background: theme.color.surface[0],
    borderRadius: theme.radius.xl,
    padding: theme.spacing(5),
    width: '90%',
    maxWidth: 420,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    textAlign: 'center',
    color: theme.color.text.primary,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    border: 'none',
    background: 'transparent',
    color: theme.color.text.primary,
    fontSize: '1.8rem',
    cursor: 'pointer',
    lineHeight: 1,
    transition: 'color 0.2s ease',
  },
  image: {
    width: 120,
    height: 120,
    objectFit: 'contain',
    margin: '0 auto',
  },
  name: {
    fontSize: '1.6rem',
    fontWeight: 700,
    textTransform: 'capitalize',
    marginBottom: theme.spacing(1),
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    background: '#1d3550',
    padding: '1em',
    borderRadius: '10px',
  },
  statItem: {
    fontSize: '0.9rem',
    textTransform: 'capitalize',
    color: theme.color.text.secondary,
  },
  infoText: {
    fontSize: '1rem',
    margin: `${theme.spacing(0.5)} 0`,
  },
}));
