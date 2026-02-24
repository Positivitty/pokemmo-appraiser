import { useState, useEffect, useCallback } from 'react';
import type { PokemonData, EvaluationInput, ScoreBreakdown } from './types';
import { evaluatePokemon } from './engine';
import { loadAllPokemon } from './data/pokeapi';
import { PokemonSearch } from './components/search/PokemonSearch';
import { EvaluationForm } from './components/evaluation/EvaluationForm';
import { ResultsDashboard } from './components/results/ResultsDashboard';
import { EvPlanPanel } from './components/ev-plan/EvPlanPanel';
import styles from './App.module.css';

type Tab = 'search' | 'evaluate' | 'results' | 'ev-plan';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  const [evaluationInput, setEvaluationInput] = useState<EvaluationInput | null>(null);
  const [results, setResults] = useState<ScoreBreakdown | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [allPokemon, setAllPokemon] = useState<PokemonData[]>([]);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 649 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadAllPokemon((loaded, total) => {
      setLoadProgress({ loaded, total });
    })
      .then(pokemon => {
        setAllPokemon(pokemon);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSelectPokemon = useCallback((pokemon: PokemonData) => {
    setSelectedPokemon(pokemon);
    setResults(null);
    setEvaluationInput(null);
    setActiveTab('evaluate');
  }, []);

  const handleEvaluate = useCallback((input: EvaluationInput) => {
    setEvaluationInput(input);
    const scoreBreakdown = evaluatePokemon(input);
    setResults(scoreBreakdown);
    setActiveTab('results');
  }, []);

  const tabs: { id: Tab; label: string; disabled: boolean }[] = [
    { id: 'search', label: 'Search', disabled: false },
    { id: 'evaluate', label: 'Evaluate', disabled: !selectedPokemon },
    { id: 'results', label: 'Results', disabled: !results },
    { id: 'ev-plan', label: 'EV Planner', disabled: !selectedPokemon },
  ];

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>PokeMMO Appraiser</h1>
          <span className={styles.subtitle}>Competitive Pokémon Evaluator</span>
        </div>
        {isLoading && (
          <div className={styles.loadingBadge}>
            Loading {loadProgress.loaded}/{loadProgress.total}
          </div>
        )}
        {!isLoading && (
          <div className={styles.countBadge}>
            {allPokemon.length} Pokémon loaded
          </div>
        )}
      </header>

      <nav className={styles.nav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {activeTab === 'search' && (
          <PokemonSearch
            allPokemon={allPokemon}
            isLoading={isLoading}
            loadProgress={loadProgress}
            onSelect={handleSelectPokemon}
            selected={selectedPokemon}
          />
        )}

        {activeTab === 'evaluate' && selectedPokemon && (
          <EvaluationForm
            pokemon={selectedPokemon}
            onEvaluate={handleEvaluate}
          />
        )}

        {activeTab === 'results' && selectedPokemon && results && (
          <ResultsDashboard
            pokemon={selectedPokemon}
            results={results}
          />
        )}

        {activeTab === 'ev-plan' && selectedPokemon && (
          <EvPlanPanel
            pokemon={selectedPokemon}
            currentEvs={evaluationInput?.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
