import type { SpriteData } from '../types';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Generate sprite URLs from a Pokémon's national dex ID */
export function buildSpriteData(id: number): SpriteData {
  return {
    default: `${SPRITE_BASE}/${id}.png`,
    shiny: `${SPRITE_BASE}/shiny/${id}.png`,
  };
}
