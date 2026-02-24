import { useState, useMemo } from 'react';
import type { PokemonData, EvaluationInput, StatName, CompetitiveBuild, StatSpread } from '../../types';
import { NATURES, getNatureByName } from '../../data/natures';
import { getBuildsForPokemon } from '../../data/builds';
import { calculateAllStats, calculatePerfectStats } from '../../utils/stat-calculator';
import { StatBar } from '../common/StatBar';
import styles from './EvaluationForm.module.css';

interface Props {
  pokemon: PokemonData;
  onEvaluate: (input: EvaluationInput) => void;
}

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE',
};

const STATS: StatName[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

const EMPTY_SPREAD = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

/**
 * Compute ideal IVs for a build.
 * Special attackers that don't invest in ATK should aim for 0 ATK IV
 * to minimize confusion/Foul Play damage.
 */
function getIdealIVs(build: CompetitiveBuild): StatSpread {
  const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

  const isSpecialAttacker =
    build.evSpread.atk === 0 &&
    (build.nature === 'Timid' || build.nature === 'Modest' ||
     build.nature === 'Bold' || build.nature === 'Calm');

  if (isSpecialAttacker) {
    ivs.atk = 0;
  }

  return ivs;
}

export function EvaluationForm({ pokemon, onEvaluate }: Props) {
  const [ivs, setIvs] = useState({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });
  const [evs, setEvs] = useState({ ...EMPTY_SPREAD });
  const [nature, setNature] = useState('Adamant');
  const [ability, setAbility] = useState(pokemon.abilities[0]);
  const [level, setLevel] = useState(50);
  const [errors, setErrors] = useState<string[]>([]);

  const builds = useMemo(() => getBuildsForPokemon(pokemon.id), [pokemon.id]);
  const [selectedBuildIdx, setSelectedBuildIdx] = useState(0);
  const activeBuild: CompetitiveBuild | null = builds[selectedBuildIdx] || null;

  const idealIVs = useMemo(() => {
    if (!activeBuild) return { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    return getIdealIVs(activeBuild);
  }, [activeBuild]);

  const calculatedStats = useMemo(() => {
    const natureData = getNatureByName(nature) || null;
    return calculateAllStats(pokemon.baseStats, ivs, evs, level, natureData);
  }, [pokemon.baseStats, ivs, evs, level, nature]);

  const perfectStats = useMemo(() => {
    return calculatePerfectStats(pokemon.baseStats, level);
  }, [pokemon.baseStats, level]);

  const idealCalcStats = useMemo(() => {
    if (!activeBuild) return null;
    const natureData = getNatureByName(activeBuild.nature) || null;
    return calculateAllStats(pokemon.baseStats, idealIVs, activeBuild.evSpread, level, natureData);
  }, [pokemon.baseStats, idealIVs, activeBuild, level]);

  const handleIvChange = (stat: StatName, value: string) => {
    const num = parseInt(value) || 0;
    setIvs(prev => ({ ...prev, [stat]: Math.min(31, Math.max(0, num)) }));
  };

  const handleEvChange = (stat: StatName, value: string) => {
    const num = parseInt(value) || 0;
    setEvs(prev => ({ ...prev, [stat]: Math.min(252, Math.max(0, num)) }));
  };

  const applyBuild = () => {
    if (!activeBuild) return;
    setIvs({ ...idealIVs });
    setEvs({ ...activeBuild.evSpread });
    setNature(activeBuild.nature);
    setAbility(activeBuild.ability);
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    const totalEvs = Object.values(evs).reduce((s, v) => s + v, 0);
    if (totalEvs > 510) errs.push(`Total EVs (${totalEvs}) exceed maximum of 510.`);
    if (level < 1 || level > 100) errs.push('Level must be between 1 and 100.');
    for (const stat of STATS) {
      if (ivs[stat] < 0 || ivs[stat] > 31) errs.push(`${STAT_LABELS[stat]} IV must be 0-31.`);
      if (evs[stat] < 0 || evs[stat] > 252) errs.push(`${STAT_LABELS[stat]} EV must be 0-252.`);
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onEvaluate({
      pokemonId: pokemon.id,
      ivs,
      evs,
      nature,
      ability,
      level,
    });
  };

  const totalEvs = Object.values(evs).reduce((s, v) => s + v, 0);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Evaluate {pokemon.name}</h3>

      {/* Recommended Build Panel */}
      {builds.length > 0 && (
        <div className={styles.buildPanel}>
          <div className={styles.buildPanelHeader}>
            <h4>Recommended Build</h4>
            {builds.length > 1 && (
              <select
                value={selectedBuildIdx}
                onChange={e => setSelectedBuildIdx(Number(e.target.value))}
                className={styles.buildSelect}
              >
                {builds.map((b, i) => (
                  <option key={i} value={i}>{b.name} ({b.role})</option>
                ))}
              </select>
            )}
          </div>

          {activeBuild && (
            <div className={styles.buildContent}>
              <div className={styles.buildMeta}>
                <span>Nature: <strong>{activeBuild.nature}</strong></span>
                <span>Ability: <strong>{activeBuild.ability}</strong></span>
                <span>Item: <strong>{activeBuild.item}</strong></span>
                <span>Tier: <strong>{activeBuild.tier}</strong></span>
              </div>

              <div className={styles.buildSpreads}>
                <div className={styles.buildSpread}>
                  <h5>Ideal IVs</h5>
                  <div className={styles.spreadRow}>
                    {STATS.map(stat => (
                      <div key={stat} className={styles.spreadCell}>
                        <span className={styles.spreadStatLabel}>{STAT_LABELS[stat]}</span>
                        <span className={`${styles.spreadStatValue} ${idealIVs[stat] === 31 ? styles.maxIv : styles.minIv}`}>
                          {idealIVs[stat]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.buildSpread}>
                  <h5>Ideal EVs</h5>
                  <div className={styles.spreadRow}>
                    {STATS.map(stat => (
                      <div key={stat} className={styles.spreadCell}>
                        <span className={styles.spreadStatLabel}>{STAT_LABELS[stat]}</span>
                        <span className={`${styles.spreadStatValue} ${activeBuild.evSpread[stat] > 0 ? styles.investedEv : ''}`}>
                          {activeBuild.evSpread[stat]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {idealCalcStats && (
                <div className={styles.idealStats}>
                  <h5>Ideal Stats at Lv. {level}</h5>
                  <div className={styles.spreadRow}>
                    {STATS.map(stat => (
                      <div key={stat} className={styles.spreadCell}>
                        <span className={styles.spreadStatLabel}>{STAT_LABELS[stat]}</span>
                        <span className={styles.idealStatValue}>{idealCalcStats[stat]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.buildMoves}>
                {activeBuild.moves.map(m => (
                  <span key={m} className={styles.move}>{m}</span>
                ))}
              </div>

              <p className={styles.buildDesc}>{activeBuild.description}</p>

              <button type="button" onClick={applyBuild} className={styles.applyBtn}>
                Auto-fill this build
              </button>
            </div>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <div className={styles.section}>
        <h4>IVs (0-31)</h4>
        <div className={styles.statGrid}>
          {STATS.map(stat => (
            <div key={stat} className={styles.statInput}>
              <label htmlFor={`iv-${stat}`}>{STAT_LABELS[stat]}</label>
              <input
                id={`iv-${stat}`}
                type="number"
                min={0}
                max={31}
                value={ivs[stat]}
                onChange={e => handleIvChange(stat, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4>EVs (0-252 each)</h4>
          <span className={`${styles.evTotal} ${totalEvs > 510 ? styles.overCap : ''}`}>
            {totalEvs} / 510
          </span>
        </div>
        <div className={styles.statGrid}>
          {STATS.map(stat => (
            <div key={stat} className={styles.statInput}>
              <label htmlFor={`ev-${stat}`}>{STAT_LABELS[stat]}</label>
              <input
                id={`ev-${stat}`}
                type="number"
                min={0}
                max={252}
                value={evs[stat]}
                onChange={e => handleEvChange(stat, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="nature">Nature</label>
          <select id="nature" value={nature} onChange={e => setNature(e.target.value)}>
            {NATURES.map(n => (
              <option key={n.name} value={n.name}>
                {n.name}
                {n.increased ? ` (+${STAT_LABELS[n.increased]} / -${STAT_LABELS[n.decreased!]})` : ' (Neutral)'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="ability">Ability</label>
          <select id="ability" value={ability} onChange={e => setAbility(e.target.value)}>
            {pokemon.abilities.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="level">Level</label>
          <input
            id="level"
            type="number"
            min={1}
            max={100}
            value={level}
            onChange={e => setLevel(parseInt(e.target.value) || 50)}
          />
        </div>
      </div>

      <div className={styles.statsPreview}>
        <h4>Calculated Stats at Lv. {level}</h4>
        <div className={styles.statsColumns}>
          <div className={styles.statsCol}>
            {STATS.map(stat => (
              <StatBar
                key={stat}
                stat={stat}
                value={calculatedStats[stat]}
                max={500}
              />
            ))}
          </div>
          <div className={styles.statsNumbers}>
            <table>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Yours</th>
                  <th>Perfect</th>
                </tr>
              </thead>
              <tbody>
                {STATS.map(stat => {
                  const diff = calculatedStats[stat] - perfectStats[stat];
                  return (
                    <tr key={stat}>
                      <td className={styles.statLabel}>{STAT_LABELS[stat]}</td>
                      <td className={styles.statValue}>{calculatedStats[stat]}</td>
                      <td className={styles.perfectValue}>
                        {perfectStats[stat]}
                        {diff !== 0 && (
                          <span className={diff > 0 ? styles.positive : styles.negative}>
                            {' '}{diff > 0 ? '+' : ''}{diff}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submit}>
        Evaluate
      </button>
    </form>
  );
}
