import type { PokemonType } from '../../types';
import styles from './TypeBadge.module.css';

interface Props {
  type: PokemonType;
}

export function TypeBadge({ type }: Props) {
  return (
    <span className={styles.badge} data-type={type}>
      {type.toUpperCase()}
    </span>
  );
}
