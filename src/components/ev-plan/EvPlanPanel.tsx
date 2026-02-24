import { useState } from 'react';
import type { PokemonData, CompetitiveBuild, EvTrainingPlan, StatName } from '../../types';
import { getBuildsForPokemon } from '../../data';
import { generateEvPlan } from '../../planner';
import styles from './EvPlanPanel.module.css';

interface Props {
  pokemon: PokemonData;
  currentEvs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
}

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE',
};

export function EvPlanPanel({ pokemon, currentEvs }: Props) {
  const builds = getBuildsForPokemon(pokemon.id);
  const [selectedBuild, setSelectedBuild] = useState<CompetitiveBuild | null>(builds[0] || null);
  const [plan, setPlan] = useState<EvTrainingPlan | null>(null);
  const [hasPokerus, setHasPokerus] = useState(false);
  const [hasPowerItem, setHasPowerItem] = useState(false);

  if (builds.length === 0) {
    return (
      <div className={styles.panel}>
        <p className={styles.noBuild}>No competitive builds available for {pokemon.name}.</p>
      </div>
    );
  }

  const handleGenerate = () => {
    if (!selectedBuild) return;
    const evPlan = generateEvPlan(currentEvs, selectedBuild);
    evPlan.pokerusMultiplier = hasPokerus;
    evPlan.powerItemMultiplier = hasPowerItem;
    setPlan(evPlan);
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>EV Training Plan</h3>

      <div className={styles.controls}>
        <div className={styles.field}>
          <label htmlFor="target-build">Target Build</label>
          <select
            id="target-build"
            value={selectedBuild?.name || ''}
            onChange={e => {
              const build = builds.find(b => b.name === e.target.value);
              setSelectedBuild(build || null);
              setPlan(null);
            }}
          >
            {builds.map(b => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.role})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.toggles}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hasPokerus}
              onChange={e => setHasPokerus(e.target.checked)}
            />
            <span>Pokerus</span>
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hasPowerItem}
              onChange={e => setHasPowerItem(e.target.checked)}
            />
            <span>Power Items</span>
          </label>
        </div>

        <button onClick={handleGenerate} className={styles.generate}>
          Generate Plan
        </button>
      </div>

      {selectedBuild && (
        <div className={styles.targetSpread}>
          <h4>Target EV Spread</h4>
          <div className={styles.spreadGrid}>
            {(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const).map(stat => (
              <div key={stat} className={styles.spreadItem}>
                <span className={styles.spreadLabel}>{STAT_LABELS[stat]}</span>
                <span className={styles.spreadValue}>{selectedBuild.evSpread[stat]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan && (
        <div className={styles.planResults}>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Remaining EVs</span>
              <span className={styles.summaryValue}>{plan.totalRemainingPoints}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Est. Battles</span>
              <span className={styles.summaryValue}>{plan.estimatedBattles}</span>
            </div>
          </div>

          {plan.vitaminsNeeded.length > 0 && (
            <div className={styles.vitamins}>
              <h4>Step 1: Use Vitamins</h4>
              <div className={styles.vitaminList}>
                {plan.vitaminsNeeded.map(v => (
                  <div key={v.stat} className={styles.vitaminItem}>
                    <span className={styles.vitaminName}>{v.vitamin}</span>
                    <span className={styles.vitaminCount}>x{v.count}</span>
                    <span className={styles.vitaminGain}>+{v.evGain} {STAT_LABELS[v.stat]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.steps}>
            <h4>{plan.vitaminsNeeded.length > 0 ? 'Step 2: Battle Training' : 'Training Steps'}</h4>
            {plan.steps.map(step => (
              <div key={step.stat} className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepStat}>{STAT_LABELS[step.stat]}</span>
                  <span className={styles.stepProgress}>
                    {step.current} → {step.target} ({step.remaining} remaining)
                  </span>
                </div>
                <div className={styles.stepTarget}>
                  <span className={styles.targetName}>
                    Defeat: <strong>{step.trainingTarget.pokemonName}</strong>
                  </span>
                  <span className={styles.targetLocation}>{step.trainingTarget.location}</span>
                </div>
                <div className={styles.battleCounts}>
                  <span>Base: {step.battlesNeeded} battles</span>
                  {hasPowerItem && <span>w/ Power Item: {step.withPowerItem}</span>}
                  {hasPokerus && <span>w/ Pokerus: {step.withPokerus}</span>}
                  {hasPokerus && hasPowerItem && <span>w/ Both: {step.withBoth}</span>}
                </div>
                {step.trainingTarget.notes && (
                  <p className={styles.targetNotes}>{step.trainingTarget.notes}</p>
                )}
              </div>
            ))}
          </div>

          {plan.steps.length === 0 && (
            <p className={styles.complete}>EVs are already optimally distributed for this build!</p>
          )}
        </div>
      )}
    </div>
  );
}
