import React from 'react';
import type { SquareProps } from '../types'

export const Square: React.FC<SquareProps> = ({ value, onClick, disabled, highlight }) => {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onClick} disabled={disabled}>
      {value === 'X' ? '❌' : value === 'O' ? '⭕' : ''}
    </button>
  );
};
