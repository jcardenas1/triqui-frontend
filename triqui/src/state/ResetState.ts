import { State } from "./State";

export class ResetState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
    ): void {
        console.log("Handle reset event")

        const setBoard = setValues['setBoard']
        const setStatus = setValues['setStatus']
        const setGameEnded = setValues['setGameEnded']
        const setWinnerPositions = setValues['setWinnerPositions']

        setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
        setStatus('Esperando a otro jugador...');
        setGameEnded(false);
        setWinnerPositions([]);
    }
}