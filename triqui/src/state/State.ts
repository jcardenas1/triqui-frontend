import type { GameState } from "../types";

export abstract class State {
    public abstract handleEvent(
        setValues: { [key: string]:  React.RefObject<any>},
        data?: GameState, 
        values?: { [key: string]: any }
    ): void;
}