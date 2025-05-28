export interface Move {
  game_id: string;
  player_id: string;
  position: [number, number];
}

export interface GameState {
  type: string;
  board: (null | 'X' | 'O')[][];
  turn?: 'X' | 'O';
  symbol?: 'X' | 'O';
  winner?: 'X' | 'O';
  positions?: [number, number][];
  game_id: number
}

export interface BoardProps {
  board: (null | 'X' | 'O')[][];
  onClick: (x: number, y: number) => void;
  disabled: boolean;
  winnerPositions: [number, number][];
}

export interface SquareProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  disabled: boolean;
  highlight: boolean;
}

export interface GameStatusProps {
  status: string;
  onReset: () => void;
  gameEnded: boolean;
}
