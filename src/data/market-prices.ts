import type { MarketPrice } from '../types';

/**
 * Community market price estimates (in PokéDollars / GTL units).
 * Prices reflect PokeMMO GTL averages for comp-ready Pokémon.
 */
export const MARKET_PRICES: MarketPrice[] = [
  {
    pokemonId: 6,
    pokemonName: 'Charizard',
    averagePrice: 350000,
    priceRange: [200000, 600000],
    demand: 'high',
    valueFactor: 'Popular competitive pick, fan favorite, viable in UU.',
  },
  {
    pokemonId: 9,
    pokemonName: 'Blastoise',
    averagePrice: 180000,
    priceRange: [100000, 300000],
    demand: 'medium',
    valueFactor: 'Reliable spinner in UU, moderate competitive demand.',
  },
  {
    pokemonId: 94,
    pokemonName: 'Gengar',
    averagePrice: 500000,
    priceRange: [300000, 800000],
    demand: 'very_high',
    valueFactor: 'Top-tier OU threat. Levitate immunity and high SpA make it always in demand.',
  },
  {
    pokemonId: 130,
    pokemonName: 'Gyarados',
    averagePrice: 400000,
    priceRange: [250000, 650000],
    demand: 'very_high',
    valueFactor: 'OU staple. Dragon Dance + Moxie combination is devastating.',
  },
  {
    pokemonId: 131,
    pokemonName: 'Lapras',
    averagePrice: 150000,
    priceRange: [80000, 250000],
    demand: 'medium',
    valueFactor: 'Niche cleric role. Water Absorb + Heal Bell provides team utility.',
  },
  {
    pokemonId: 149,
    pokemonName: 'Dragonite',
    averagePrice: 600000,
    priceRange: [400000, 900000],
    demand: 'very_high',
    valueFactor: 'Premium OU threat. Multiscale + DD makes it one of the best sweepers.',
  },
  {
    pokemonId: 212,
    pokemonName: 'Scizor',
    averagePrice: 550000,
    priceRange: [350000, 800000],
    demand: 'very_high',
    valueFactor: 'Top OU pick. Technician Bullet Punch + U-turn is unmatched utility.',
  },
  {
    pokemonId: 248,
    pokemonName: 'Tyranitar',
    averagePrice: 500000,
    priceRange: [300000, 750000],
    demand: 'high',
    valueFactor: 'Sand Stream weather setter with massive stats. OU staple.',
  },
  {
    pokemonId: 373,
    pokemonName: 'Salamence',
    averagePrice: 450000,
    priceRange: [280000, 700000],
    demand: 'high',
    valueFactor: 'Versatile OU dragon. Mixed sets are hard to predict and counter.',
  },
  {
    pokemonId: 398,
    pokemonName: 'Staraptor',
    averagePrice: 200000,
    priceRange: [120000, 350000],
    demand: 'medium',
    valueFactor: 'Reckless CB Brave Bird is insane power but recoil limits longevity.',
  },
];

export function getMarketPrice(pokemonId: number): MarketPrice | undefined {
  return MARKET_PRICES.find(p => p.pokemonId === pokemonId);
}
