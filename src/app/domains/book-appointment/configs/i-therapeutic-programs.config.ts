import { CardType } from "../../../common";

export interface ITherapeuticProgram {
    id?: string;
    title: string,
    cost?: number,
    details: string,
    sessionsNumber?: number,
    programSeats?: number,
    programRegistered?: number
}
