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

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const queueRef = useRef<GameState[]>([]); // Cola de mensajes
  const processingRef = useRef(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const playerSymbolRef = useRef('');
  const socketRef = useRef<WebSocket | null>(null);
  const gameIdRef = useRef<number | null>(null)
  const playerIdRef = useRef<string>('')
  const boardRef = useRef<(null | 'X' | 'O')[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const currentTurnRef = useRef<'X' | 'O' | null>(null);
  const statusRef = useRef<string>('');
  const gameEndedRef = useRef<boolean>(false);
  const winnerPositionsRef = useRef<[number, number][]>([]);
  const [board, setBoard] = useState<(null | 'X' | 'O')[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const disconnectEvent = useRef<string>('');
  
  const handleEvent = (data: GameState) => {
    let context: Context | null;

    if (data.game_id != gameIdRef.current) return

    if (data.type === 'init') {
      context = new Context(new WaitState());
      context.request(
        {
          "playerSymbolRef": playerSymbolRef, 
          "statusRef": statusRef, 
        },
        data 
      )
    } else if (data.type === 'start') {
      context = new Context(new StartState());
      context.request(
        {
          "boardRef": boardRef, 
          "currentTurnRef": currentTurnRef, 
          "statusRef": statusRef, 
          "gameEndedRef": gameEndedRef, 
          "winnerPositionsRef": winnerPositionsRef,
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'update') {
      context = new Context(new ChangeTurnState());
      context.request(
        {
          "boardRef": boardRef, 
          "currentTurnRef": currentTurnRef, 
          "statusRef": statusRef, 
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'win') {
      context = new Context(new WinState());
      context.request(
        {
          "boardRef": boardRef, 
          "statusRef": statusRef, 
          "gameEndedRef": gameEndedRef, 
          "winnerPositionsRef": winnerPositionsRef,
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else if (data.type === 'draw') {
      context = new Context(new DrawState());
      context.request(
        {
          "boardRef": boardRef, 
          "statusRef": statusRef, 
          "gameEndedRef": gameEndedRef, 
        },
        data
      )
    } else if (data.type === 'disconnect') {
      disconnectEvent.current = data.type

      context = new Context(new DisconnecState());
      context.request(
        {
          "statusRef": statusRef, 
          "gameEndedRef": gameEndedRef, 
        }
      )
    } else if (data.type === 'reset') {
      context = new Context(new ResetState());
      context.request(
        {
          "boardRef": boardRef, 
          "statusRef": statusRef, 
          "gameEndedRef": gameEndedRef, 
          "winnerPositionsRef": winnerPositionsRef,
          "currentTurnRef": currentTurnRef,
        },
        data, 
        {"playerSymbol": playerSymbolRef.current}
      )
    } else {
      console.error("State does not exist");
      return;
    }

    setBoard(data.board)
  }

  const handleQueue = () => {
    if (processingRef.current || queueRef.current.length === 0) return;

    processingRef.current = true;

    while (queueRef.current.length > 0) {
      const data = queueRef.current.shift();
      if (!data) continue;

      handleEvent(data);
    }

    processingRef.current = false;
  }

  const handleWebsocket = () =>{
    if (!gameIdRef.current || !playerIdRef.current) return;

    const socket = new WebSocket(`ws://localhost:8000/${gameIdRef.current}/${playerIdRef.current}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsSocketReady(true);
    };

    socket.onmessage = (event) => {
      const data: GameState = JSON.parse(event.data);
      queueRef.current.push(data);
      handleQueue();
    };

    socket.onclose = () => {
      console.log('Socket cerrado');
      setIsSocketReady(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }

  const getGameId = async () => {
    if (gameIdRef.current) return gameIdRef.current;

    try{
      const response = await fetch("http://localhost:8000/game_waiting");
      const data = await response.json();

      if (!data.game_waiting) {
        const newGameId = getRandomInt(1, 100);
        return newGameId;
      }

      return parseInt(data.game_waiting);
    } catch (error) {
      console.error("Error fetching data:", error);
      const newGameId = getRandomInt(1, 100);
      return newGameId;
    }

  }

  const getPlayerId = async () => {
    if (playerIdRef.current) return playerIdRef.current

    const random = getRandomInt(1, 100);
    const playerID = `player_${random}`;

    return playerID
  }

  useEffect(() => {
  const fetchData = async () => {
    gameIdRef.current = await getGameId();
    playerIdRef.current = await getPlayerId();
    handleWebsocket();
  };

  fetchData();
}, []);

  const handleClick = (x: number, y: number) => {
    if (!socketRef.current && !isSocketReady) return
    if (boardRef.current[x][y] || currentTurnRef.current !== playerSymbolRef.current || gameEndedRef.current) return;

    socketRef.current?.send(JSON.stringify({ 
      game_id: gameIdRef.current ?? '', 
      player_id: playerIdRef.current, 
      position: [x, y] 
    } as Move));
  };

  const handleReset = () => {
    if (!socketRef.current) return;

    if (disconnectEvent.current) {
      window.location.reload();
      return;
    }
    
    socketRef.current.send(JSON.stringify({ type: 'reset', game_id: gameIdRef.current }));
  };

  return (
    <div className="app">
      <GameStatus status={statusRef.current} onReset={handleReset} gameEnded={gameEndedRef.current} />
      <Board 
        onClick={handleClick} 
        board={board} 
        disabled={currentTurnRef.current !== playerSymbolRef.current || gameEndedRef.current} 
        winnerPositions={winnerPositionsRef.current} 
      />
    </div>
  );
}

export default App
