import { IAnswer } from "./i-answer.model";

export interface Question {
    id: number;
    text: string;
    answers: IAnswer[];
}