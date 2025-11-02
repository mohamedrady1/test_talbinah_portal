import { IDoctorAvailability } from "../../../../domains/talbinah-bot/models";

export interface IGlobalDoctorCardModel {
    full_name?: string;
    specialist?: string[];
    specialist_id?: number[];
    bio?: string;
    gender?: number;
    reservation_count?: number;
    avg_rate?: number;
    count_rate?: number;
    image?: string;
    price_half_hour?: number;
    years_experience?: number;
    copouns?: any[]; // adjust if needed
    nextAvailability?: IDoctorAvailability;
}