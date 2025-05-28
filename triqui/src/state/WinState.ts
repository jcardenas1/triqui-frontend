import type { GameState } from "../types";
import { State } from "./State";

export class WinState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.RefObject<any>},
        data: GameState, 
        values: { [key: string]: any }
    ): void {
        const boardRef = setValues['boardRef']
        const statusRef = setValues['statusRef']
        const gameEndedRef = setValues['gameEndedRef']
        const winnerPositionsRef = setValues['winnerPositionsRef']

        boardRef.current = data.board
        statusRef.current = data.winner === values['playerSymbol'] ? '¡Ganaste!' : 'Perdiste';
        gameEndedRef.current = true;
        if (data.positions) winnerPositionsRef.current = data.positions;
    }
}