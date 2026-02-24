import type { StatSpread, StatName, Nature } from '../types';

/**
 * Calculate a Pokémon's actual stat value using the standard formula.
 *
 * HP formula:  floor((2 * Base + IV + floor(EV/4)) * Level / 100) + Level + 10
 * Other stats: floor((floor((2 * Base + IV + floor(EV/4)) * Level / 100) + 5) * NatureMod)
 */
export function calculateStat(
  stat: StatName,
  base: number,
  iv: number,
  ev: number,
  level: number,
  nature: Nature | null
): number {
  const evContribution = Math.floor(ev / 4);

  if (stat === 'hp') {
    // Shedinja check — always 1 HP
    if (base === 1) return 1;
    return Math.floor(((2 * base + iv + evContribution) * level) / 100) + level + 10;
  }

  let value = Math.floor(((2 * base + iv + evContribution) * level) / 100) + 5;

  if (nature) {
    if (nature.increased === stat) value = Math.floor(value * 1.1);
    if (nature.decreased === stat) value = Math.floor(value * 0.9);
  }

  return value;
}

/**
 * Calculate all 6 stats for a Pokémon.
 */
export function calculateAllStats(
  baseStats: StatSpread,
  ivs: StatSpread,
  evs: StatSpread,
  level: number,
  nature: Nature | null
): StatSpread {
  const stats: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  const result: StatSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  for (const stat of stats) {
    result[stat] = calculateStat(stat, baseStats[stat], ivs[stat], evs[stat], level, nature);
  }

  return result;
}

/**
 * Calculate perfect stats (31 IVs, 0 EVs) at a given level with a neutral nature.
 * Useful for showing what a Pokémon looks like at its best baseline.
 */
export function calculatePerfectStats(
  baseStats: StatSpread,
  level: number
): StatSpread {
  const perfectIVs: StatSpread = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
  const zeroEVs: StatSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  return calculateAllStats(baseStats, perfectIVs, zeroEVs, level, null);
}

/**
 * Calculate max possible stats (31 IVs, 252 EVs in each — hypothetical ceiling per stat).
 */
export function calculateMaxStat(
  stat: StatName,
  base: number,
  level: number
): number {
  return calculateStat(stat, base, 31, 252, level, null);
}
