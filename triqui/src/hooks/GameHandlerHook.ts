import { useRef } from 'react';
import { Context } from '../state/Context';
import { WaitState } from '../state/WaitState';
import { StartState } from '../state/StartState';
import { ChangeTurnState } from '../state/ChangeTurnState';
import { WinState } from '../state/WinState';
import { DrawState } from '../state/DrawState';
import { DisconnecState } from '../state/DisconnectState';
import { ResetState } from '../state/ResetState';
import type { GameState } from '../types';

export const useGameHandler = (
  setBoard: React.Dispatch<React.SetStateAction<(null | 'X' | 'O')[][]>>,
  winnerPositionsRef: React.RefObject<[number, number][]>,
  setPlayerSymbol: React.Dispatch<React.SetStateAction<string>>,
) => {
  const boardRef = useRef<(null | 'X' | 'O')[][]>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const currentTurnRef = useRef<'X' | 'O' | null>(null);
  const statusRef = useRef<string>('');
  const gameEndedRef = useRef<boolean>(false);
  const playerSymbolRef = useRef('');
  const disconnectEvent = useRef<string>('');

  const handleEvent = (data: GameState, gameIdRef: React.MutableRefObject<number | null>) => {
    let context: Context | null;

    if (data.game_id != gameIdRef.current) return;

    const sharedRefs = {
      boardRef, currentTurnRef, statusRef,
      gameEndedRef, winnerPositionsRef,
      playerSymbolRef
    };

    switch (data.type) {
      case 'init':
        context = new Context(new WaitState());
        context.request({ playerSymbolRef, statusRef }, data);
        setPlayerSymbol(playerSymbolRef.current);
        break;
      case 'start':
        context = new Context(new StartState());
        context.request(sharedRefs, data, { playerSymbol: playerSymbolRef.current });
        break;
      case 'update':
        context = new Context(new ChangeTurnState());
        context.request(sharedRefs, data, { playerSymbol: playerSymbolRef.current });
        break;
      case 'win':
        context = new Context(new WinState());
        context.request(sharedRefs, data, { playerSymbol: playerSymbolRef.current });
        break;
      case 'draw':
        context = new Context(new DrawState());
        context.request(sharedRefs, data);
        break;
      case 'disconnect':
        disconnectEvent.current = data.type;
        context = new Context(new DisconnecState());
        context.request({ statusRef, gameEndedRef });
        break;
      case 'reset':
        context = new Context(new ResetState());
        context.request(sharedRefs, data, { playerSymbol: playerSymbolRef.current });
        break;
      default:
        console.error('State does not exist');
        return;
    }

    boardRef.current = data.board;
    setBoard(data.board);
  };

  return {
    handleEvent,
    hasGameEnded: () => gameEndedRef.current,
    disconnectMessage: () => disconnectEvent.current,
    boardRef,
    currentTurnRef,
    playerSymbolRef,
    statusRef,
  };
};
