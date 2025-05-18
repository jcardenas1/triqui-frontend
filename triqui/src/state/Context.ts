import type { GameState } from '../types';
import { State } from './State'

export class Context {
    /**
     * @type {State} A reference to the current state of the Context.
     */
    private state: State | undefined;

    constructor(state: State) {
        this.transitionTo(state)
    }

    /**
     * The Context allows changing the Product object at runtime.
     */
    public transitionTo(state: State): void {
        console.log(`Context: Transition to ${state.constructor.name}.`);
        this.state = state;
    }

    /**
     * The Context delegates part of its behavior to the current Product object.
     */
    public request(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>}, 
        data?: GameState, 
        values?: {[key: string]: any}
    ): void {
        this.state?.handleEvent(setValues, data, values);
    }

}