import type { EvaluationInput, ScoreBreakdown, Grade, CompetitiveBuild } from '../types';
import { getPokemonById, getBuildsForPokemon, getMarketPrice } from '../data';
import { scoreIVs } from './iv-scorer';
import { scoreNature } from './nature-scorer';
import { scoreAbility } from './ability-scorer';
import { scoreEvEfficiency } from './ev-scorer';

/**
 * Weight configuration for the final score.
 * Competitive factors (IVs, nature, ability, EVs) = 70%
 * Market factors = 30%
 */
const WEIGHTS = {
  /** How heavily IVs affect competitive score */
  IV: 0.35,
  /** How heavily nature match affects competitive score */
  NATURE: 0.30,
  /** How heavily ability match affects competitive score */
  ABILITY: 0.20,
  /** How heavily EV efficiency affects competitive score */
  EV_EFFICIENCY: 0.15,

  /** Competitive score contributes 70% to final */
  COMPETITIVE: 0.70,
  /** Market score contributes 30% to final */
  MARKET: 0.30,
} as const;

/**
 * Grade boundaries — deterministic mapping from score to letter grade.
 * S: 85+  (exceptional — near-perfect IVs, optimal nature/ability)
 * A: 70+  (competitive-ready, minor imperfections)
 * B: 50+  (usable but needs improvement)
 * C: <50  (not competitive, breeding stock or casual use)
 */
const GRADE_THRESHOLDS: [number, Grade][] = [
  [85, 'S'],
  [70, 'A'],
  [50, 'B'],
  [0, 'C'],
];

function mapScoreToGrade(score: number): Grade {
  for (const [threshold, grade] of GRADE_THRESHOLDS) {
    if (score >= threshold) return grade;
  }
  return 'C';
}

/**
 * Find the best-matching build for this Pokémon's current stats.
 * Matches by ability first, then falls back to the first available build.
 */
function findBestMatchingBuild(
  pokemonId: number,
  ability: string
): CompetitiveBuild | null {
  const builds = getBuildsForPokemon(pokemonId);
  if (builds.length === 0) return null;

  // Prefer build that matches the ability
  const abilityMatch = builds.find(
    b => b.ability.toLowerCase() === ability.toLowerCase()
  );
  return abilityMatch || builds[0];
}

/**
 * Calculate market score based on IV quality and demand.
 * Perfect IVs + high demand = higher market value.
 *
 * Formula:
 * - Base: IV score (quality of the Pokémon)
 * - Multiplier: demand factor (1.0 / 1.1 / 1.3 / 1.5)
 * - Capped at 100
 */
function calculateMarketScore(ivScore: number, pokemonId: number): number {
  const price = getMarketPrice(pokemonId);
  if (!price) return ivScore * 0.5; // Unknown Pokémon = half credit

  const demandMultiplier: Record<string, number> = {
    low: 1.0,
    medium: 1.1,
    high: 1.3,
    very_high: 1.5,
  };

  const multiplier = demandMultiplier[price.demand] ?? 1.0;
  return Math.min(100, ivScore * multiplier);
}

/**
 * Generate recommendations based on the evaluation.
 */
function generateRecommendations(
  ivScore: number,
  natureScore: number,
  abilityScore: number,
  evEfficiency: number,
  build: CompetitiveBuild | null
): string[] {
  const recs: string[] = [];

  if (ivScore < 70) {
    recs.push('Consider breeding for higher IVs — aim for 28+ in key stats.');
  }
  if (natureScore < 50 && build) {
    recs.push(`Ideal nature for this build is ${build.nature}. Consider breeding for it.`);
  }
  if (abilityScore < 50 && build) {
    recs.push(`${build.ability} is the preferred ability for competitive play.`);
  }
  if (evEfficiency < 60) {
    recs.push('EV spread needs optimization. Use the EV Planner to get on track.');
  }
  if (ivScore >= 90 && natureScore >= 90 && abilityScore >= 75) {
    recs.push('Excellent specimen! This Pokémon is competition-ready.');
  }

  return recs;
}

/**
 * Main evaluation function — deterministic, pure computation.
 *
 * Input: Pokémon stats from the user
 * Output: Complete score breakdown with grade and recommendations
 */
export function evaluatePokemon(input: EvaluationInput): ScoreBreakdown {
  const pokemon = getPokemonById(input.pokemonId);
  if (!pokemon) {
    throw new Error(`Unknown Pokémon ID: ${input.pokemonId}`);
  }

  const builds = getBuildsForPokemon(input.pokemonId);
  const matchedBuild = findBestMatchingBuild(input.pokemonId, input.ability);

  // Individual component scores (0-100 each)
  const ivScore = scoreIVs(input.ivs, matchedBuild);
  const natureScore = scoreNature(input.nature, matchedBuild);
  const abilityScore = scoreAbility(input.ability, builds, matchedBuild);
  const evEfficiency = scoreEvEfficiency(input.evs, matchedBuild);

  // Weighted competitive score (0-100)
  const competitiveScore =
    ivScore * WEIGHTS.IV +
    natureScore * WEIGHTS.NATURE +
    abilityScore * WEIGHTS.ABILITY +
    evEfficiency * WEIGHTS.EV_EFFICIENCY;

  // Market score (0-100)
  const marketScore = calculateMarketScore(ivScore, input.pokemonId);

  // Final weighted score (0-100)
  const finalScore =
    competitiveScore * WEIGHTS.COMPETITIVE +
    marketScore * WEIGHTS.MARKET;

  const grade = mapScoreToGrade(finalScore);
  const recommendations = generateRecommendations(
    ivScore, natureScore, abilityScore, evEfficiency, matchedBuild
  );

  return {
    ivScore: Math.round(ivScore * 10) / 10,
    natureScore: Math.round(natureScore * 10) / 10,
    abilityScore: Math.round(abilityScore * 10) / 10,
    evEfficiency: Math.round(evEfficiency * 10) / 10,
    competitiveScore: Math.round(competitiveScore * 10) / 10,
    marketScore: Math.round(marketScore * 10) / 10,
    finalScore: Math.round(finalScore * 10) / 10,
    grade,
    matchedBuild,
    recommendations,
  };
}
