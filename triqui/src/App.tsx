import { useState, useEffect, useRef } from 'react'
import type { GameState, Move } from './types.ts'
import { GameStatus } from './components/GameStatus.tsx';
import { Board } from './components/Board.tsx';
import './App.css'
import { Context } from './state/Context.ts';
import { WaitState } from './state/WaitState.ts';
import { StartState } from './state/StartState.ts';
import { ChangeTurnState } from './state/ChangeTurnState.ts';
import { WinState } from './state/WinState.ts';
import { DrawState } from './state/DrawState.ts';
import { DisconnecState } from './state/DisconnectState.ts';
import { ResetState } from './state/ResetState.ts';

function App() {
  const [board, setBoard] = useState<(null | 'X' | 'O')[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'X' | 'O' | null>(null);
  const [status, setStatus] = useState<string>('Esperando a otro jugador...');
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winnerPositions, setWinnerPositions] = useState<[number, number][]>([]);
  const playerSymbolRef = useRef(playerSymbol);
  const socketRef = useRef<WebSocket | null>(null);

  const handleEvent = (data: GameState) => {
    let context: Context | null;

    if (data.type === 'init') {
      context = new Context(new WaitState());
      context.request(
        {
          "setPlayerSymbol": setPlayerSymbol, 
          "setStatus": setStatus, 
        },
        data 
      )
    } else if (data.type === 'start') {
      context = new Context(new StartState());
      context.request(
        {
          "setBoard": setBoard, 
          "setCurrentTurn": setCurrentTurn, 
          "setStatus": setStatus, 
          "setGameEnded": setGameEnded, 
          "setWinnerPositions": setWinnerPositions,
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'update') {
      context = new Context(new ChangeTurnState());
      context.request(
        {
          "setBoard": setBoard, 
          "setCurrentTurn": setCurrentTurn, 
          "setStatus": setStatus, 
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'win') {
      context = new Context(new WinState());
      context.request(
        {
          "setBoard": setBoard, 
          "setStatus": setStatus, 
          "setGameEnded": setGameEnded, 
          "setWinnerPositions": setWinnerPositions,
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'draw') {
      context = new Context(new DrawState());
      context.request(
        {
          "setBoard": setBoard, 
          "setStatus": setStatus, 
          "setGameEnded": setGameEnded, 
        },
        data
      )
    } else if (data.type === 'disconnected') {
      context = new Context(new DisconnecState());
      context.request(
        {
          "setStatus": setStatus, 
          "setGameEnded": setGameEnded, 
        }
      )
    } else if (data.type === 'reset') {
      context = new Context(new ResetState());
      context.request(
        {
          "setBoard": setBoard, 
          "setStatus": setStatus, 
          "setGameEnded": setGameEnded, 
          "setWinnerPositions": setWinnerPositions,
        },
      )
    } else {
      console.log("State does not exist");
      return;
    }
  }

  useEffect(() => {
    playerSymbolRef.current = playerSymbol;
  }, [playerSymbol]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Conectado al backend');
    };
    
    ws.onmessage = (event) => {
      const data: GameState = JSON.parse(event.data);
      handleEvent(data)
    };

    ws.onclose = () => {
      console.log('Socket cerrado');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleClick = (x: number, y: number) => {
    if (!socketRef.current || board[x][y] || currentTurn !== playerSymbol || gameEnded) return;
    console.log("Sending move: X: ", x, "Y: ",y)
    socketRef.current.send(JSON.stringify({ type: 'move', position: [x, y] } as Move));
  };

  const handleReset = () => {
    if (!socketRef.current) return;
    socketRef.current.send(JSON.stringify({ type: 'reset' }));
  };

  return (
    <div className="app">
      <GameStatus status={status} onReset={handleReset} gameEnded={gameEnded} />
      <Board board={board} onClick={handleClick} disabled={currentTurn !== playerSymbol || gameEnded} winnerPositions={winnerPositions} />
    </div>
  );
}

export default App
