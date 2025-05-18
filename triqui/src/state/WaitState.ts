import type { GameState } from "../types";
import { State } from "./State";

export class WaitState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
        data: GameState, 
    ): void {
        console.log("Handle wait event")
        console.log(">>>>>>>>>>>>>>DATA: ", data)
        const setPlayerSymbol = setValues['setPlayerSymbol']
        const setStatus = setValues['setStatus']

        setPlayerSymbol(data.turn ?? null);
        setStatus('Esperando a otro jugador...');

    }
}