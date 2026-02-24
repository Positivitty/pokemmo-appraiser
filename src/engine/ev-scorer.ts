import type { StatSpread, CompetitiveBuild, StatName } from '../types';

/** Maximum total EVs a Pokémon can have */
const MAX_TOTAL_EVS = 510;
/** Maximum EVs in a single stat */
const MAX_STAT_EVS = 252;

/**
 * Score EV efficiency from 0-100 based on how well current EVs
 * align with the target build's EV spread.
 *
 * Factors:
 * 1. Alignment: How close current EVs are to the build's spread (70%)
 * 2. Waste: Penalty for EVs in stats the build doesn't want (20%)
 * 3. Completeness: How much of the total 510 is invested (10%)
 */
export function scoreEvEfficiency(
  currentEvs: StatSpread,
  build: CompetitiveBuild | null
): number {
  if (!build) return 50;

  const stats: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

  // 1. Alignment score — how close each stat's EVs are to the target
  let alignmentScore = 0;
  let alignmentWeight = 0;

  for (const stat of stats) {
    const target = build.evSpread[stat];
    const current = currentEvs[stat];
    const maxDiff = Math.max(target, MAX_STAT_EVS - target);

    if (maxDiff === 0) {
      // Both target and max diff are 0 — perfect alignment
      alignmentScore += current === 0 ? 1 : 0;
    } else {
      const diff = Math.abs(target - current);
      alignmentScore += 1 - diff / maxDiff;
    }
    alignmentWeight += 1;
  }

  const alignment = (alignmentScore / alignmentWeight) * 100;

  // 2. Waste penalty — EVs in stats with 0 target
  let wastedEvs = 0;
  for (const stat of stats) {
    if (build.evSpread[stat] === 0 && currentEvs[stat] > 0) {
      wastedEvs += currentEvs[stat];
    }
  }
  const wasteScore = Math.max(0, 100 - (wastedEvs / MAX_TOTAL_EVS) * 200);

  // 3. Completeness — how much of the 510 budget is used
  const totalCurrent = Object.values(currentEvs).reduce((s, v) => s + v, 0);
  const completeness = Math.min(100, (totalCurrent / MAX_TOTAL_EVS) * 100);

  // Weighted final score
  const ALIGNMENT_WEIGHT = 0.7;
  const WASTE_WEIGHT = 0.2;
  const COMPLETENESS_WEIGHT = 0.1;

  return (
    alignment * ALIGNMENT_WEIGHT +
    wasteScore * WASTE_WEIGHT +
    completeness * COMPLETENESS_WEIGHT
  );
}
