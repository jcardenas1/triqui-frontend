import { State } from "./State";

export class DisconnecState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.Dispatch<React.SetStateAction<any>>},
    ): void {
        console.log("Handle disconnect event")

        const setStatus = setValues['setStatus']
        const setGameEnded = setValues['setGameEnded']

        setStatus('El oponente se desconectó. ¿Reiniciar partida?');
        setGameEnded(true);
    }
}