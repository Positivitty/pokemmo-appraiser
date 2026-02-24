import { useState, useMemo } from 'react';
import type { PokemonData, StatName } from '../../types';
import { calculatePerfectStats } from '../../utils/stat-calculator';
import { PokemonSprite } from '../common/PokemonSprite';
import { TypeBadge } from '../common/TypeBadge';
import { StatBar } from '../common/StatBar';
import styles from './PokemonSearch.module.css';

interface Props {
  allPokemon: PokemonData[];
  isLoading: boolean;
  loadProgress: { loaded: number; total: number };
  onSelect: (pokemon: PokemonData) => void;
  selected: PokemonData | null;
}

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE',
};

const STATS: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export function PokemonSearch({ allPokemon, isLoading, loadProgress, onSelect, selected }: Props) {
  const [query, setQuery] = useState('');
  const [showPerfect, setShowPerfect] = useState(false);
  const [perfectLevel, setPerfectLevel] = useState(50);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allPokemon;
    return allPokemon.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toString() === q ||
      p.types.some(t => t.includes(q))
    );
  }, [query, allPokemon]);

  // Only render first 60 for performance, user can search to narrow down
  const displayResults = results.slice(0, 60);

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name, ID, or type..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.input}
          aria-label="Search Pokémon"
        />
        <div className={styles.searchControls}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={showPerfect}
              onChange={e => setShowPerfect(e.target.checked)}
            />
            <span>Perfect Stats</span>
          </label>
          {showPerfect && (
            <select
              value={perfectLevel}
              onChange={e => setPerfectLevel(Number(e.target.value))}
              className={styles.levelSelect}
            >
              <option value={50}>Lv. 50</option>
              <option value={100}>Lv. 100</option>
            </select>
          )}
          <span className={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''}
            {results.length > 60 ? ' (showing 60)' : ''}
          </span>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.loadingBar}>
            <div
              className={styles.loadingFill}
              style={{ width: `${(loadProgress.loaded / loadProgress.total) * 100}%` }}
            />
          </div>
          <p>Loading Pokémon from PokeAPI... {loadProgress.loaded}/{loadProgress.total}</p>
        </div>
      )}

      <div className={styles.grid}>
        {displayResults.map(pokemon => {
          const perfect = showPerfect
            ? calculatePerfectStats(pokemon.baseStats, perfectLevel)
            : null;

          return (
            <button
              key={pokemon.id}
              className={`${styles.card} ${selected?.id === pokemon.id ? styles.selected : ''}`}
              onClick={() => onSelect(pokemon)}
            >
              <PokemonSprite sprites={pokemon.sprites} name={pokemon.name} size={64} />
              <div className={styles.cardInfo}>
                <span className={styles.pokemonName}>{pokemon.name}</span>
                <span className={styles.pokemonId}>#{pokemon.id}</span>
                <div className={styles.types}>
                  {pokemon.types.map(t => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </div>
              <div className={styles.statsPreview}>
                {STATS.map(stat => (
                  <StatBar
                    key={stat}
                    stat={stat}
                    value={showPerfect && perfect ? perfect[stat] : pokemon.baseStats[stat]}
                    max={showPerfect ? 500 : 200}
                    label={showPerfect
                      ? `${STAT_LABELS[stat]} ${perfect![stat]}`
                      : undefined
                    }
                  />
                ))}
                {showPerfect && (
                  <div className={styles.perfectLabel}>
                    31 IVs / 0 EVs / Lv.{perfectLevel}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isLoading && results.length === 0 && (
        <p className={styles.empty}>No Pokémon found matching "{query}"</p>
      )}
    </div>
  );
}
