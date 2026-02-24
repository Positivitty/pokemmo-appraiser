import styles from './ScoreCard.module.css';

interface Props {
  label: string;
  score: number;
  color?: string;
}

export function ScoreCard({ label, score, color }: Props) {
  const barColor = color || getScoreColor(score);

  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.score}>{score.toFixed(1)}</span>
      <div className={styles.barBg}>
        <div
          className={styles.bar}
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'var(--grade-s)';
  if (score >= 70) return 'var(--grade-a)';
  if (score >= 50) return 'var(--grade-b)';
  return 'var(--grade-c)';
}
