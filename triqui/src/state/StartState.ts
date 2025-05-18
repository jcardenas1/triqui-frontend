import type { GameState } from "../types";
import { State } from "./State";

export class StartState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
        data: GameState, 
        values: { [key: string]: any }
    ): void {
        console.log("Handle start event")
        console.log("DATA: ", data)
        console.log("values: ", values)
        const setBoard = setValues['setBoard']
        const setCurrentTurn = setValues['setCurrentTurn']
        const setStatus = setValues['setStatus']
        const setGameEnded = setValues['setGameEnded']
        const setWinnerPositions = setValues['setWinnerPositions']

        setBoard(data.board);
        setCurrentTurn(data.turn ?? null);
        setStatus(data.turn === values.playerSymbol ? 'Tu turno' : 'Turno del oponente');
        setGameEnded(false);
        setWinnerPositions([]);
    }
}