import type { GameState } from "../types";
import { State } from "./State";

export class WinState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
        data: GameState, 
        values: { [key: string]: any }
    ): void {
        console.log("Handle win event")
        console.log(">>>>>>>>>values: ", values)
        console.log(">>>>>>>>>data: ", data)
        const setBoard = setValues['setBoard']
        const setStatus = setValues['setStatus']
        const setGameEnded = setValues['setGameEnded']
        const setWinnerPositions = setValues['setWinnerPositions']

        setBoard(data.board);
        setStatus(data.winner === values['playerSymbol'] ? '¡Ganaste!' : 'Perdiste');
        setGameEnded(true);
        if (data.positions) setWinnerPositions(data.positions);
    }
}