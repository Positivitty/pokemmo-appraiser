import type { StatName } from '../../types';
import styles from './StatBar.module.css';

interface Props {
  stat: StatName;
  value: number;
  max?: number;
  label?: string;
}

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  atk: 'ATK',
  def: 'DEF',
  spa: 'SPA',
  spd: 'SPD',
  spe: 'SPE',
};

export function StatBar({ stat, value, max = 255, label }: Props) {
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label || STAT_LABELS[stat]}</span>
      <span className={styles.value}>{value}</span>
      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          data-stat={stat}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
