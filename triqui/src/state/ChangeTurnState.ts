import type { GameState } from "../types";
import { State } from "./State";

export class ChangeTurnState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>}, 
        data: GameState, 
        values: { [key: string]: any }
    ): void {
        console.log("Handle change turn event")

        const setBoard = setValues['setBoard']
        const setCurrentTurn = setValues['setCurrentTurn']
        const setStatus = setValues['setStatus']

        setBoard(data.board);
        setCurrentTurn(data.turn ?? null);
        setStatus(data.turn === values['playerSymbol'] ? 'Tu turno' : 'Turno del oponente');
    }
}