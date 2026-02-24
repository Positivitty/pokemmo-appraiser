import type { PokemonData, PokemonType, StatSpread } from '../types';
import { buildSpriteData } from '../utils/sprites';

/**
 * PokeMMO uses Gen 1-5 Pokémon (National Dex #1-649).
 * This module fetches all of them from PokeAPI on demand.
 */
const MAX_DEX_ID = 649;
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

const STAT_MAP: Record<string, keyof StatSpread> = {
  'hp': 'hp',
  'attack': 'atk',
  'defense': 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  'speed': 'spe',
};

const VALID_TYPES = new Set([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]);

/** In-memory cache of all loaded Pokémon */
let pokemonCache: PokemonData[] = [];
let loadPromise: Promise<PokemonData[]> | null = null;

interface PokeAPIPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
}

function formatAbilityName(name: string): string {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function parsePokeAPIPokemon(data: PokeAPIPokemon): PokemonData {
  const stats: StatSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  for (const s of data.stats) {
    const key = STAT_MAP[s.stat.name];
    if (key) stats[key] = s.base_stat;
  }

  const types = data.types
    .map(t => t.type.name)
    .filter(t => VALID_TYPES.has(t)) as PokemonType[];

  const abilities = data.abilities.map(a => formatAbilityName(a.ability.name));

  return {
    id: data.id,
    name: formatPokemonName(data.name),
    types,
    baseStats: stats,
    abilities,
    sprites: buildSpriteData(data.id),
  };
}

/**
 * Fetch a batch of Pokémon by their IDs concurrently.
 * Uses batched requests to avoid overwhelming the API.
 */
async function fetchBatch(ids: number[]): Promise<PokemonData[]> {
  const results = await Promise.allSettled(
    ids.map(id =>
      fetch(`${POKEAPI_BASE}/pokemon/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(parsePokeAPIPokemon)
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<PokemonData> => r.status === 'fulfilled')
    .map(r => r.value);
}

/**
 * Load all 649 Gen 1-5 Pokémon from PokeAPI.
 * Fetches in batches of 50 to be respectful to the API.
 * Returns cached results on subsequent calls.
 */
export async function loadAllPokemon(
  onProgress?: (loaded: number, total: number) => void
): Promise<PokemonData[]> {
  if (pokemonCache.length > 0) return pokemonCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const BATCH_SIZE = 50;
    const allPokemon: PokemonData[] = [];

    for (let start = 1; start <= MAX_DEX_ID; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE - 1, MAX_DEX_ID);
      const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      const batch = await fetchBatch(ids);
      allPokemon.push(...batch);

      onProgress?.(allPokemon.length, MAX_DEX_ID);
    }

    allPokemon.sort((a, b) => a.id - b.id);
    pokemonCache = allPokemon;
    return allPokemon;
  })();

  return loadPromise;
}

/**
 * Search loaded Pokémon by name, ID, or type.
 */
export function searchLoadedPokemon(query: string): PokemonData[] {
  const q = query.toLowerCase().trim();
  if (!q) return pokemonCache;
  return pokemonCache.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.id.toString() === q ||
    p.types.some(t => t.includes(q))
  );
}

/**
 * Get a loaded Pokémon by ID.
 */
export function getLoadedPokemonById(id: number): PokemonData | undefined {
  return pokemonCache.find(p => p.id === id);
}

/**
 * Check if data has been loaded.
 */
export function isDataLoaded(): boolean {
  return pokemonCache.length > 0;
}

export function getLoadedCount(): number {
  return pokemonCache.length;
}
