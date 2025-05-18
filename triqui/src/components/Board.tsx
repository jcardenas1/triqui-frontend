import React from 'react';
import { Square } from './Square';
import type { BoardProps } from '../types' 

export const Board: React.FC<BoardProps> = ({ board, onClick, disabled, winnerPositions }) => {
  return (
    <div className="board">
      {board.map((row, x) =>
        row.map((cell, y) => (
          <Square
            key={`${x}-${y}`}
            value={cell}
            onClick={() => onClick(x, y)}
            disabled={disabled || cell !== null}
            highlight={winnerPositions.some(([i, j]) => i === x && j === y)}
          />
        ))
      )}
    </div>
  );
};