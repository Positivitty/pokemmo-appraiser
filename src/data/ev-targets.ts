import type { EvTrainingTarget } from '../types';

/**
 * EV training hotspots in PokeMMO — optimized Pokémon for each stat.
 * Locations reference common PokeMMO training routes.
 */
export const EV_TRAINING_TARGETS: EvTrainingTarget[] = [
  // HP
  {
    pokemonName: 'Dunsparce',
    pokemonId: 206,
    location: 'Route 208 (Sinnoh)',
    stat: 'hp',
    evYield: 1,
    level: '18-20',
    notes: '100% encounter rate. Reliable HP EV spot.',
  },
  {
    pokemonName: 'Stunfisk',
    pokemonId: 618,
    location: 'Icirrus City (Unova) - Surfing',
    stat: 'hp',
    evYield: 2,
    level: '25-35',
    notes: 'Gives 2 HP EVs per KO. Use Surf to encounter.',
  },
  // Attack
  {
    pokemonName: 'Patrat',
    pokemonId: 504,
    location: 'Route 1 (Unova)',
    stat: 'atk',
    evYield: 1,
    level: '2-4',
    notes: 'Low level, easy KOs. High encounter rate.',
  },
  {
    pokemonName: 'Lillipup',
    pokemonId: 506,
    location: 'Route 1 (Unova)',
    stat: 'atk',
    evYield: 1,
    level: '2-4',
    notes: 'Also on Route 1. Can grind both Patrat and Lillipup.',
  },
  // Defense
  {
    pokemonName: 'Geodude',
    pokemonId: 74,
    location: 'RPokemon League Victory Road',
    stat: 'def',
    evYield: 1,
    level: '29-31',
    notes: 'Common in caves. 1 Def EV each.',
  },
  {
    pokemonName: 'Sandshrew',
    pokemonId: 27,
    location: 'Relic Castle (Unova)',
    stat: 'def',
    evYield: 1,
    level: '19-22',
    notes: 'Consistent Defense EV source.',
  },
  // Special Attack
  {
    pokemonName: 'Litwick',
    pokemonId: 607,
    location: 'Celestial Tower (Unova)',
    stat: 'spa',
    evYield: 1,
    level: '26-29',
    notes: 'Best SpA EV training spot. Near 100% encounter rate.',
  },
  {
    pokemonName: 'Elgyem',
    pokemonId: 605,
    location: 'Celestial Tower (Unova)',
    stat: 'spa',
    evYield: 1,
    level: '26-29',
    notes: 'Shares location with Litwick for efficient SpA training.',
  },
  // Special Defense
  {
    pokemonName: 'Tentacool',
    pokemonId: 72,
    location: 'Surfing (Various)',
    stat: 'spd',
    evYield: 1,
    level: '15-25',
    notes: 'Available in many water routes. Easy SpD EVs.',
  },
  {
    pokemonName: 'Frillish',
    pokemonId: 592,
    location: 'Driftveil City (Unova) - Surfing',
    stat: 'spd',
    evYield: 1,
    level: '25-35',
    notes: 'Gives 1 SpD EV. Decent encounter rate while surfing.',
  },
  // Speed
  {
    pokemonName: 'Basculin',
    pokemonId: 550,
    location: 'Route 1 (Unova) - Surfing',
    stat: 'spe',
    evYield: 2,
    level: '15-25',
    notes: '2 Speed EVs per KO. Excellent Speed training spot.',
  },
  {
    pokemonName: 'Joltik',
    pokemonId: 595,
    location: 'Chargestone Cave (Unova)',
    stat: 'spe',
    evYield: 1,
    level: '24-27',
    notes: '1 Speed EV per KO. Common encounter.',
  },
];

export function getTargetsForStat(stat: string): EvTrainingTarget[] {
  return EV_TRAINING_TARGETS.filter(t => t.stat === stat);
}
