import type { CompetitiveBuild } from '../types';
import { getNatureByName } from '../data/natures';

/**
 * Score a nature from 0-100 based on how well it matches a competitive build.
 *
 * Scoring rules:
 * - Exact match to build's nature: 100
 * - Same increased stat, different decreased stat: 70
 *   (right boost, wrong dump — still usable)
 * - Neutral nature: 40
 *   (no penalty but no benefit)
 * - Wrong nature that boosts an unused stat: 20
 * - Nature that decreases a key stat: 10
 *   (actively harmful)
 */
export function scoreNature(natureName: string, build: CompetitiveBuild | null): number {
  if (!build) return 50; // No build context = neutral score

  // Exact nature match
  if (natureName.toLowerCase() === build.nature.toLowerCase()) return 100;

  const nature = getNatureByName(natureName);
  const buildNature = getNatureByName(build.nature);

  if (!nature || !buildNature) return 0;

  // Neutral nature
  if (!nature.increased && !nature.decreased) return 40;

  // Same boosted stat as build
  if (nature.increased === buildNature.increased) {
    // Right boost, but does the decreased stat hurt?
    if (nature.decreased && build.evSpread[nature.decreased] > 0) {
      return 50; // Decreases a stat the build invests in — partial penalty
    }
    return 70; // Right boost, harmless dump
  }

  // Check if the nature harms a key stat
  if (nature.decreased && buildNature.increased === nature.decreased) {
    return 10; // Actively reduces the build's primary stat
  }

  // Boosts a stat the build doesn't use
  if (nature.increased && build.evSpread[nature.increased] === 0) {
    return 20;
  }

  // Boosts a secondary stat the build uses
  return 35;
}
