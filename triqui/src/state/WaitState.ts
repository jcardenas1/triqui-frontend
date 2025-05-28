import type { GameState } from "../types";
import { State } from "./State";

export class WaitState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.RefObject<any>},
        data: GameState, 
    ): void {
        const playerSymbolRef = setValues['playerSymbolRef']
        const statusRef = setValues['statusRef']

        playerSymbolRef.current = data.turn ?? null;
        statusRef.current = 'Esperando a otro jugador...';

    }
}