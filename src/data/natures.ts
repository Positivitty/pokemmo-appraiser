import type { Nature } from '../types';

/** All 25 Pokémon natures with stat modifiers */
export const NATURES: Nature[] = [
  // Neutral natures
  { name: 'Hardy', increased: null, decreased: null },
  { name: 'Docile', increased: null, decreased: null },
  { name: 'Serious', increased: null, decreased: null },
  { name: 'Bashful', increased: null, decreased: null },
  { name: 'Quirky', increased: null, decreased: null },
  // +Atk
  { name: 'Lonely', increased: 'atk', decreased: 'def' },
  { name: 'Brave', increased: 'atk', decreased: 'spe' },
  { name: 'Adamant', increased: 'atk', decreased: 'spa' },
  { name: 'Naughty', increased: 'atk', decreased: 'spd' },
  // +Def
  { name: 'Bold', increased: 'def', decreased: 'atk' },
  { name: 'Relaxed', increased: 'def', decreased: 'spe' },
  { name: 'Impish', increased: 'def', decreased: 'spa' },
  { name: 'Lax', increased: 'def', decreased: 'spd' },
  // +SpA
  { name: 'Modest', increased: 'spa', decreased: 'atk' },
  { name: 'Mild', increased: 'spa', decreased: 'def' },
  { name: 'Quiet', increased: 'spa', decreased: 'spe' },
  { name: 'Rash', increased: 'spa', decreased: 'spd' },
  // +SpD
  { name: 'Calm', increased: 'spd', decreased: 'atk' },
  { name: 'Gentle', increased: 'spd', decreased: 'def' },
  { name: 'Sassy', increased: 'spd', decreased: 'spe' },
  { name: 'Careful', increased: 'spd', decreased: 'spa' },
  // +Spe
  { name: 'Timid', increased: 'spe', decreased: 'atk' },
  { name: 'Hasty', increased: 'spe', decreased: 'def' },
  { name: 'Jolly', increased: 'spe', decreased: 'spa' },
  { name: 'Naive', increased: 'spe', decreased: 'spd' },
];

export function getNatureByName(name: string): Nature | undefined {
  return NATURES.find(n => n.name.toLowerCase() === name.toLowerCase());
}
