import type {
  StatSpread,
  StatName,
  CompetitiveBuild,
  EvTrainingPlan,
  EvTrainingStep,
  VitaminRecommendation,
} from '../types';
import { getTargetsForStat } from '../data/ev-targets';

/** Maximum EVs in a single stat */
const MAX_STAT_EVS = 252;
/** Maximum total EVs across all stats */
const MAX_TOTAL_EVS = 510;
/** EVs gained per vitamin (up to 100 EVs per stat via vitamins) */
const EV_PER_VITAMIN = 10;
/** Max EVs achievable via vitamins per stat */
const VITAMIN_CAP = 100;

/** Power item bonus EVs per battle */
const POWER_ITEM_BONUS = 8;
/** Pokérus doubles all EV gains */
const POKERUS_MULTIPLIER = 2;

/** Vitamin names for each stat */
const VITAMIN_MAP: Record<StatName, string> = {
  hp: 'HP Up',
  atk: 'Protein',
  def: 'Iron',
  spa: 'Calcium',
  spd: 'Zinc',
  spe: 'Carbos',
};

const STAT_ORDER: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

/**
 * Clamp a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate the remaining EVs needed for each stat.
 * Respects the 252 per-stat and 510 total caps.
 */
function calculateRemainingEvs(
  current: StatSpread,
  target: StatSpread
): StatSpread {
  const remaining: StatSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

  for (const stat of STAT_ORDER) {
    const targetVal = clamp(target[stat], 0, MAX_STAT_EVS);
    const currentVal = clamp(current[stat], 0, MAX_STAT_EVS);
    remaining[stat] = Math.max(0, targetVal - currentVal);
  }

  return remaining;
}

/**
 * Calculate vitamin recommendations.
 * Vitamins can give up to 100 EVs per stat (10 vitamins * 10 EVs each).
 * Only recommend vitamins for stats that need EVs.
 */
function calculateVitamins(
  current: StatSpread,
  remaining: StatSpread
): VitaminRecommendation[] {
  const vitamins: VitaminRecommendation[] = [];

  for (const stat of STAT_ORDER) {
    if (remaining[stat] <= 0) continue;

    // Vitamins only work up to 100 EVs in that stat
    const currentInStat = current[stat];
    const vitaminSpace = Math.max(0, VITAMIN_CAP - currentInStat);

    if (vitaminSpace <= 0) continue;

    const evsViaVitamins = Math.min(remaining[stat], vitaminSpace);
    const vitaminCount = Math.floor(evsViaVitamins / EV_PER_VITAMIN);

    if (vitaminCount > 0) {
      vitamins.push({
        vitamin: VITAMIN_MAP[stat],
        stat,
        count: vitaminCount,
        evGain: vitaminCount * EV_PER_VITAMIN,
      });
    }
  }

  return vitamins;
}

/**
 * Build step-by-step training plan for each stat that needs EVs.
 */
function buildTrainingSteps(
  current: StatSpread,
  remaining: StatSpread
): EvTrainingStep[] {
  const steps: EvTrainingStep[] = [];

  for (const stat of STAT_ORDER) {
    if (remaining[stat] <= 0) continue;

    const targets = getTargetsForStat(stat);
    const bestTarget = targets.reduce((best, t) =>
      t.evYield > best.evYield ? t : best,
      targets[0]
    );

    if (!bestTarget) continue;

    const baseYield = bestTarget.evYield;
    const evsNeeded = remaining[stat];

    // Battles = ceil(EVs needed / yield per battle)
    const battlesNeeded = Math.ceil(evsNeeded / baseYield);

    // With power item: yield + 8 per battle
    const withPowerItem = Math.ceil(evsNeeded / (baseYield + POWER_ITEM_BONUS));

    // With Pokérus: yield * 2 per battle
    const withPokerus = Math.ceil(evsNeeded / (baseYield * POKERUS_MULTIPLIER));

    // With both: (yield + 8) * 2 per battle
    const withBoth = Math.ceil(
      evsNeeded / ((baseYield + POWER_ITEM_BONUS) * POKERUS_MULTIPLIER)
    );

    steps.push({
      stat,
      target: current[stat] + remaining[stat],
      current: current[stat],
      remaining: evsNeeded,
      trainingTarget: bestTarget,
      battlesNeeded,
      withPowerItem,
      withPokerus,
      withBoth,
    });
  }

  return steps;
}

/**
 * Generate a complete EV training plan.
 *
 * Given a Pokémon's current EVs and a target competitive build,
 * produces a step-by-step plan including:
 * - Which stats need training
 * - Where to train
 * - How many battles
 * - Vitamin shortcuts
 * - Pokérus + Power Item optimizations
 */
export function generateEvPlan(
  currentEvs: StatSpread,
  targetBuild: CompetitiveBuild
): EvTrainingPlan {
  // Validate current EVs don't exceed cap
  const totalCurrent = Object.values(currentEvs).reduce((s, v) => s + v, 0);
  if (totalCurrent > MAX_TOTAL_EVS) {
    throw new Error(
      `Current EVs (${totalCurrent}) exceed maximum (${MAX_TOTAL_EVS})`
    );
  }

  const remaining = calculateRemainingEvs(currentEvs, targetBuild.evSpread);
  const totalRemaining = Object.values(remaining).reduce((s, v) => s + v, 0);

  const steps = buildTrainingSteps(currentEvs, remaining);
  const vitamins = calculateVitamins(currentEvs, remaining);

  // Total battles estimated (without items/virus for conservative estimate)
  const estimatedBattles = steps.reduce((sum, s) => sum + s.battlesNeeded, 0);

  return {
    targetBuild,
    currentEvs,
    remainingEvs: remaining,
    totalRemainingPoints: totalRemaining,
    steps,
    vitaminsNeeded: vitamins,
    estimatedBattles,
    pokerusMultiplier: false,
    powerItemMultiplier: false,
  };
}
