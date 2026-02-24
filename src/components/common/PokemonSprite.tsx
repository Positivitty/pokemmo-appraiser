import { useState } from 'react';
import type { SpriteData } from '../../types';

interface Props {
  sprites: SpriteData;
  name: string;
  size?: number;
  shiny?: boolean;
}

export function PokemonSprite({ sprites, name, size = 96, shiny = false }: Props) {
  const [error, setError] = useState(false);
  const src = shiny ? sprites.shiny : sprites.default;

  if (error) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)',
          fontSize: 12,
        }}
      >
        ?
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setError(true)}
      style={{
        imageRendering: 'pixelated',
        objectFit: 'contain',
      }}
    />
  );
}
