import { Signal } from "@angular/core";

export interface iAnswer {
    id: number;
    value: string;
    isSelected: boolean;
}

export interface IQuestion {
    id: number;
    question: string;
    answers: iAnswer[];
    correctAnswerId: number;
}


export interface IHeaderConfig {
    image: string;
    title: string;
    subtitle: string;
}

export interface IPopupData {
    questions: Signal<IQuestion[]>;
    headerConfig: IHeaderConfig;
}