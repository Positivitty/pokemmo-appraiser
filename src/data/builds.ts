import type { CompetitiveBuild } from '../types';

/**
 * Competitive builds sourced from PokeMMO meta.
 * Each Pokémon may have multiple viable builds.
 */
export const COMPETITIVE_BUILDS: CompetitiveBuild[] = [
  // Charizard
  {
    name: 'Special Sweeper',
    pokemonId: 6,
    tier: 'UU',
    role: 'Special Attacker',
    nature: 'Timid',
    ability: 'Solar Power',
    evSpread: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    moves: ['Fire Blast', 'Air Slash', 'Solar Beam', 'Roost'],
    item: 'Life Orb',
    description: 'Sun-boosted special sweeper. Devastating under sun with Solar Power + Life Orb.',
  },
  {
    name: 'Defensive Pivot',
    pokemonId: 6,
    tier: 'UU',
    role: 'Defensive',
    nature: 'Bold',
    ability: 'Blaze',
    evSpread: { hp: 248, atk: 0, def: 156, spa: 0, spd: 8, spe: 96 },
    moves: ['Flamethrower', 'Roost', 'Will-O-Wisp', 'Toxic'],
    item: 'Leftovers',
    description: 'Physically defensive set leveraging Will-O-Wisp and reliable recovery.',
  },
  // Gengar
  {
    name: 'Special Sweeper',
    pokemonId: 94,
    tier: 'OU',
    role: 'Special Attacker',
    nature: 'Timid',
    ability: 'Levitate',
    evSpread: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
    moves: ['Shadow Ball', 'Sludge Wave', 'Focus Blast', 'Thunderbolt'],
    item: 'Life Orb',
    description: 'Classic Gengar sweeper. High speed and SpA with great coverage.',
  },
  {
    name: 'SubDisable',
    pokemonId: 94,
    tier: 'OU',
    role: 'Utility',
    nature: 'Timid',
    ability: 'Levitate',
    evSpread: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
    moves: ['Substitute', 'Disable', 'Shadow Ball', 'Focus Blast'],
    item: 'Black Sludge',
    description: 'Forces opponents into predictable moves, then Disables them behind a Sub.',
  },
  // Gyarados
  {
    name: 'Dragon Dance Sweeper',
    pokemonId: 130,
    tier: 'OU',
    role: 'Physical Sweeper',
    nature: 'Adamant',
    ability: 'Moxie',
    evSpread: { hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252 },
    moves: ['Dragon Dance', 'Waterfall', 'Bounce', 'Earthquake'],
    item: 'Lum Berry',
    description: 'Classic DD sweeper. Moxie snowballs after the first KO.',
  },
  {
    name: 'Bulky Dragon Dance',
    pokemonId: 130,
    tier: 'OU',
    role: 'Bulky Sweeper',
    nature: 'Jolly',
    ability: 'Intimidate',
    evSpread: { hp: 88, atk: 168, def: 0, spa: 0, spd: 0, spe: 252 },
    moves: ['Dragon Dance', 'Waterfall', 'Bounce', 'Taunt'],
    item: 'Leftovers',
    description: 'Bulkier DD set with Intimidate for more setup opportunities.',
  },
  // Dragonite
  {
    name: 'Dragon Dance',
    pokemonId: 149,
    tier: 'OU',
    role: 'Physical Sweeper',
    nature: 'Adamant',
    ability: 'Multiscale',
    evSpread: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
    moves: ['Dragon Dance', 'Outrage', 'Extreme Speed', 'Earthquake'],
    item: 'Lum Berry',
    description: 'Multiscale guarantees at least one DD. Extreme Speed provides priority.',
  },
  // Scizor
  {
    name: 'Choice Band',
    pokemonId: 212,
    tier: 'OU',
    role: 'Wallbreaker',
    nature: 'Adamant',
    ability: 'Technician',
    evSpread: { hp: 248, atk: 252, def: 0, spa: 0, spd: 8, spe: 0 },
    moves: ['Bullet Punch', 'U-turn', 'Superpower', 'Pursuit'],
    item: 'Choice Band',
    description: 'Technician-boosted Bullet Punch hits extremely hard. U-turn for momentum.',
  },
  {
    name: 'Swords Dance',
    pokemonId: 212,
    tier: 'OU',
    role: 'Setup Sweeper',
    nature: 'Adamant',
    ability: 'Technician',
    evSpread: { hp: 252, atk: 252, def: 0, spa: 0, spd: 4, spe: 0 },
    moves: ['Swords Dance', 'Bullet Punch', 'Bug Bite', 'Superpower'],
    item: 'Life Orb',
    description: 'Swords Dance + priority Bullet Punch makes Scizor a terrifying late-game cleaner.',
  },
  // Tyranitar
  {
    name: 'Choice Band',
    pokemonId: 248,
    tier: 'OU',
    role: 'Wallbreaker',
    nature: 'Adamant',
    ability: 'Sand Stream',
    evSpread: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
    moves: ['Stone Edge', 'Crunch', 'Pursuit', 'Superpower'],
    item: 'Choice Band',
    description: 'Massive attack stat with Band. Sand Stream boosts SpD by 50%.',
  },
  // Salamence
  {
    name: 'Dragon Dance',
    pokemonId: 373,
    tier: 'OU',
    role: 'Physical Sweeper',
    nature: 'Jolly',
    ability: 'Moxie',
    evSpread: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
    moves: ['Dragon Dance', 'Outrage', 'Earthquake', 'Fire Fang'],
    item: 'Lum Berry',
    description: 'DD + Moxie snowball. Jolly to outspeed key threats after one boost.',
  },
  {
    name: 'Mixed Attacker',
    pokemonId: 373,
    tier: 'OU',
    role: 'Mixed Attacker',
    nature: 'Naive',
    ability: 'Intimidate',
    evSpread: { hp: 0, atk: 104, def: 0, spa: 180, spd: 0, spe: 224 },
    moves: ['Draco Meteor', 'Earthquake', 'Fire Blast', 'Outrage'],
    item: 'Life Orb',
    description: 'Breaks through physical walls with special moves. Unpredictable and hard to switch into.',
  },
  // Blastoise
  {
    name: 'Rapid Spin Support',
    pokemonId: 9,
    tier: 'UU',
    role: 'Utility',
    nature: 'Bold',
    ability: 'Torrent',
    evSpread: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 },
    moves: ['Scald', 'Rapid Spin', 'Toxic', 'Ice Beam'],
    item: 'Leftovers',
    description: 'Reliable hazard removal with good bulk. Scald burns deter physical attackers.',
  },
  // Lapras
  {
    name: 'Bulky Water',
    pokemonId: 131,
    tier: 'UU',
    role: 'Defensive',
    nature: 'Calm',
    ability: 'Water Absorb',
    evSpread: { hp: 252, atk: 0, def: 0, spa: 4, spd: 252, spe: 0 },
    moves: ['Surf', 'Ice Beam', 'Thunderbolt', 'Heal Bell'],
    item: 'Leftovers',
    description: 'Specially defensive wall with Water Absorb for team support and Heal Bell cleric.',
  },
  // Staraptor
  {
    name: 'Choice Band',
    pokemonId: 398,
    tier: 'UU',
    role: 'Wallbreaker',
    nature: 'Adamant',
    ability: 'Reckless',
    evSpread: { hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252 },
    moves: ['Brave Bird', 'Double-Edge', 'Close Combat', 'U-turn'],
    item: 'Choice Band',
    description: 'Reckless-boosted STAB Brave Bird and Double-Edge hit like a truck.',
  },
];

export function getBuildsForPokemon(pokemonId: number): CompetitiveBuild[] {
  return COMPETITIVE_BUILDS.filter(b => b.pokemonId === pokemonId);
}

export function getBestBuild(pokemonId: number): CompetitiveBuild | undefined {
  return COMPETITIVE_BUILDS.find(b => b.pokemonId === pokemonId);
}
