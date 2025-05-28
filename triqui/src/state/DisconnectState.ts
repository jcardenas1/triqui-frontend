import { State } from "./State";

export class DisconnecState extends State {
    public handleEvent(
        setValues: { [key: string]:  React.RefObject<any>},
    ): void {
        const statusRef = setValues['statusRef']
        const gameEndedRef = setValues['gameEndedRef']

        statusRef.current = 'El oponente se desconectó. ¿Reiniciar partida?';
        gameEndedRef.current = true;
    }
}