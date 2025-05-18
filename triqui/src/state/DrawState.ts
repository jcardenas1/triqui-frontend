import type { GameState } from "../types";
import { State } from "./State";

export class DrawState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
        data: GameState, 
    ): void {
        console.log("Handle draw event")
        const setBoard = setValues['setBoard']
        const setStatus = setValues['setStatus']
        const setGameEnded = setValues['setGameEnded']

        setBoard(data.board);
        setStatus('Empate');
        setGameEnded(true);
    }
}