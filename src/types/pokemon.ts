/** Pokémon stat names used throughout the system */
export type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

/** Six-stat spread used for base stats, IVs, EVs */
export interface StatSpread {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

/** Nature effect: +10% to one stat, -10% to another (or neutral) */
export interface Nature {
  name: string;
  increased: StatName | null;
  decreased: StatName | null;
}

/** Sprite URLs for a Pokémon — extensible for future sprite types */
export interface SpriteData {
  default: string;
  shiny: string;
  /** Future: animated, hd_artwork, showdown */
  [key: string]: string;
}

/** Pokémon type */
export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

/** Core Pokémon species data */
export interface PokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: StatSpread;
  abilities: string[];
  sprites: SpriteData;
}

/** A competitive build recommendation */
export interface CompetitiveBuild {
  name: string;
  pokemonId: number;
  tier: string;
  role: string;
  nature: string;
  ability: string;
  evSpread: StatSpread;
  moves: string[];
  item: string;
  description: string;
}

/** EV training target — which stat to train and how */
export interface EvTrainingTarget {
  pokemonName: string;
  pokemonId: number;
  location: string;
  stat: StatName;
  evYield: number;
  level: string;
  notes: string;
}

/** Community market price data */
export interface MarketPrice {
  pokemonId: number;
  pokemonName: string;
  /** Average price in PokéDollars */
  averagePrice: number;
  /** Price range [min, max] */
  priceRange: [number, number];
  /** Demand level */
  demand: 'low' | 'medium' | 'high' | 'very_high';
  /** What makes this Pokémon valuable */
  valueFactor: string;
}

/** User input for evaluation */
export interface EvaluationInput {
  pokemonId: number;
  ivs: StatSpread;
  evs: StatSpread;
  nature: string;
  ability: string;
  level: number;
}

/** Score breakdown from evaluation engine */
export interface ScoreBreakdown {
  ivScore: number;
  natureScore: number;
  abilityScore: number;
  evEfficiency: number;
  competitiveScore: number;
  marketScore: number;
  finalScore: number;
  grade: Grade;
  matchedBuild: CompetitiveBuild | null;
  recommendations: string[];
}

/** Final grade tiers */
export type Grade = 'S' | 'A' | 'B' | 'C';

/** EV Training plan output */
export interface EvTrainingPlan {
  targetBuild: CompetitiveBuild;
  currentEvs: StatSpread;
  remainingEvs: StatSpread;
  totalRemainingPoints: number;
  steps: EvTrainingStep[];
  vitaminsNeeded: VitaminRecommendation[];
  estimatedBattles: number;
  pokerusMultiplier: boolean;
  powerItemMultiplier: boolean;
}

export interface EvTrainingStep {
  stat: StatName;
  target: number;
  current: number;
  remaining: number;
  trainingTarget: EvTrainingTarget;
  battlesNeeded: number;
  withPowerItem: number;
  withPokerus: number;
  withBoth: number;
}

export interface VitaminRecommendation {
  vitamin: string;
  stat: StatName;
  count: number;
  evGain: number;
}
