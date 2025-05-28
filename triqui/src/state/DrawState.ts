import type { GameState } from "../types";
import { State } from "./State";

export class DrawState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.RefObject<any>},
        data: GameState, 
    ): void {
        const boardRef = setValues['boardRef']
        const statusRef = setValues['statusRef']
        const gameEndedRef = setValues['gameEndedRef']

        boardRef.current = data.board;
        statusRef.current = 'Empate';
        gameEndedRef.current = true;
    }
}