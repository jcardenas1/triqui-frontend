import type { GameState } from "../types";
import { State } from "./State";

export class ChangeTurnState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.RefObject<any>}, 
        data: GameState, 
        values: { [key: string]: any }
    ): void {
        const boardRef = setValues['boardRef']
        const currentTurnRef = setValues['currentTurnRef']
        const statusRef = setValues['statusRef']

        boardRef.current = data.board;
        currentTurnRef.current = data.turn ?? null;
        statusRef.current = data.turn === values['playerSymbol'] ? 'Tu turno' : 'Turno del oponente';
    }
}