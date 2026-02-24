import type { ScoreBreakdown, PokemonData } from '../../types';
import { getMarketPrice } from '../../data';
import { GradeBadge } from '../common/GradeBadge';
import { PokemonSprite } from '../common/PokemonSprite';
import { ScoreCard } from './ScoreCard';
import styles from './ResultsDashboard.module.css';

interface Props {
  pokemon: PokemonData;
  results: ScoreBreakdown;
}

export function ResultsDashboard({ pokemon, results }: Props) {
  const price = getMarketPrice(pokemon.id);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <PokemonSprite sprites={pokemon.sprites} name={pokemon.name} size={80} />
        <div className={styles.headerInfo}>
          <h3>{pokemon.name} Appraisal</h3>
          <div className={styles.finalScore}>
            <GradeBadge grade={results.grade} size="lg" />
            <div className={styles.scoreText}>
              <span className={styles.scoreNumber}>{results.finalScore.toFixed(1)}</span>
              <span className={styles.scoreLabel}>Final Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scoreGrid}>
        <ScoreCard label="IV Quality" score={results.ivScore} />
        <ScoreCard label="Nature Match" score={results.natureScore} />
        <ScoreCard label="Ability Match" score={results.abilityScore} />
        <ScoreCard label="EV Efficiency" score={results.evEfficiency} />
        <ScoreCard label="Competitive" score={results.competitiveScore} />
        <ScoreCard label="Market Value" score={results.marketScore} />
      </div>

      {results.matchedBuild && (
        <div className={styles.buildMatch}>
          <h4>Best Matched Build</h4>
          <div className={styles.buildCard}>
            <div className={styles.buildHeader}>
              <span className={styles.buildName}>{results.matchedBuild.name}</span>
              <span className={styles.buildTier}>{results.matchedBuild.tier}</span>
            </div>
            <p className={styles.buildDesc}>{results.matchedBuild.description}</p>
            <div className={styles.buildDetails}>
              <span>Nature: <strong>{results.matchedBuild.nature}</strong></span>
              <span>Ability: <strong>{results.matchedBuild.ability}</strong></span>
              <span>Item: <strong>{results.matchedBuild.item}</strong></span>
              <span>Role: <strong>{results.matchedBuild.role}</strong></span>
            </div>
            <div className={styles.moves}>
              {results.matchedBuild.moves.map(m => (
                <span key={m} className={styles.move}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {price && (
        <div className={styles.market}>
          <h4>Market Estimate</h4>
          <div className={styles.priceInfo}>
            <div className={styles.priceMain}>
              <span className={styles.priceLabel}>Average Price</span>
              <span className={styles.priceValue}>
                {price.averagePrice.toLocaleString()}
              </span>
            </div>
            <div className={styles.priceMeta}>
              <span>Range: {price.priceRange[0].toLocaleString()} - {price.priceRange[1].toLocaleString()}</span>
              <span>Demand: <strong className={styles[price.demand]}>{price.demand.replace('_', ' ')}</strong></span>
            </div>
          </div>
        </div>
      )}

      {results.recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <h4>Recommendations</h4>
          <ul>
            {results.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
