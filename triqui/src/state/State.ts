import type { GameState } from "../types";

export abstract class State {
    public abstract handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
        data?: GameState, 
        values?: { [key: string]: any }
    ): void;
}