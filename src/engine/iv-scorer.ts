import type { StatSpread, CompetitiveBuild, StatName } from '../types';

/** Maximum IV value per stat */
const MAX_IV = 31;
/** Total stats count */
const STAT_COUNT = 6;

/**
 * Score IVs from 0-100 based on how close they are to perfect (31).
 *
 * Weighting: Stats used by the competitive build are weighted more heavily.
 * - Key stats (those with EVs invested): 2x weight
 * - Non-key stats: 1x weight
 *
 * Special case: If the build doesn't invest in Attack, a lower Attack IV
 * is actually better (reduces confusion/Foul Play damage), so we invert.
 */
export function scoreIVs(ivs: StatSpread, build: CompetitiveBuild | null): number {
  if (!build) {
    // Without a build context, simple average
    const total = Object.values(ivs).reduce((sum, iv) => sum + iv, 0);
    return (total / (MAX_IV * STAT_COUNT)) * 100;
  }

  const stats: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const stat of stats) {
    const evInvested = build.evSpread[stat] > 0;
    const weight = evInvested ? 2 : 1;

    let ivValue = ivs[stat];

    // If build doesn't invest EVs in Attack, lower Atk IV is better
    // (reduces confusion & Foul Play damage for special attackers)
    if (stat === 'atk' && !evInvested &&
        (build.nature === 'Timid' || build.nature === 'Modest' ||
         build.nature === 'Bold' || build.nature === 'Calm')) {
      ivValue = MAX_IV - ivValue; // Invert: 0 Atk IV = 31 score
    }

    weightedSum += (ivValue / MAX_IV) * weight;
    totalWeight += weight;
  }

  return (weightedSum / totalWeight) * 100;
}
