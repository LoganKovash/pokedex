import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  height?: number;
  weight?: number;
  capture_rate?: number;
  stats?: {
    name: string;
    base_stat: number;
  }[];
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: '',
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: p.pokemontypes?.map((t: any) => t.type?.typenames?.[0]?.name) ?? [],
          sprite: p.pokemonsprites?.[0]?.sprites ?? undefined,
        }),
      ) ?? [],
    loading,
    error,
  };
};

export const useGetPokemonDetails = (id: number) => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const pokemonData = data?.pokemon?.[0];

  if (!pokemonData && !loading) {
    console.warn(`No Pokémon found for id ${id}`);
  }

  const detail: PokemonDetail | undefined = pokemonData
    ? {
        id: pokemonData.id,
        name: pokemonData.pokemonspecy?.pokemonspeciesnames?.[0]?.name,
        sprite: pokemonData.pokemonsprites?.[0]?.sprites,
        types: pokemonData.pokemontypes?.map((t: any) => t.type?.typenames?.[0]?.name) ?? [],
        height: pokemonData.height,
        weight: pokemonData.weight,
        capture_rate: pokemonData.pokemonspecy?.capture_rate,
        stats:
          pokemonData.pokemonstats?.map((s: any) => ({
            name: s.stat.name,
            base_stat: s.base_stat,
          })) ?? [],
      }
    : undefined;

  return { data: detail, loading, error };
};
