import type { Grade } from '../../types';
import styles from './GradeBadge.module.css';

interface Props {
  grade: Grade;
  size?: 'sm' | 'lg';
}

export function GradeBadge({ grade, size = 'sm' }: Props) {
  return (
    <span className={`${styles.badge} ${styles[size]}`} data-grade={grade}>
      {grade}
    </span>
  );
}
