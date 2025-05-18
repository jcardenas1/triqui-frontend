import React from 'react';
import type { GameStatusProps } from '../types';

export const GameStatus: React.FC<GameStatusProps> = ({ status, onReset, gameEnded }) => {
  return (
    <div className="status-bar">
      <div>{status}</div>
      {gameEnded && <button onClick={onReset}>Reiniciar</button>}
    </div>
  );
};
