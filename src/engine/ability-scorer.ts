import type { CompetitiveBuild } from '../types';

/**
 * Score an ability from 0-100 based on how it matches competitive builds.
 *
 * Scoring:
 * - Exact match to best build's ability: 100
 * - Matches any alternative build's ability: 75
 * - Ability exists on the Pokémon but not used competitively: 30
 * - Otherwise: 0 (shouldn't happen with valid data)
 */
export function scoreAbility(
  ability: string,
  builds: CompetitiveBuild[],
  primaryBuild: CompetitiveBuild | null
): number {
  if (!primaryBuild || builds.length === 0) return 50;

  const abilityLower = ability.toLowerCase();

  // Exact match to the primary/best build
  if (primaryBuild.ability.toLowerCase() === abilityLower) return 100;

  // Matches an alternative build's ability
  const alternativeMatch = builds.find(
    b => b.ability.toLowerCase() === abilityLower
  );
  if (alternativeMatch) return 75;

  // Ability exists but isn't competitively preferred
  return 30;
}
