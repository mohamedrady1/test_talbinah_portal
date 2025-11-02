import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStartMissionDataDto } from '../dtos';

@Injectable({
    providedIn: 'root'
})
export class MissionDataService {
    private missionDataSubject = new BehaviorSubject<IStartMissionDataDto | null>(null);
    public missionData$ = this.missionDataSubject.asObservable();

    setMissionData(data: IStartMissionDataDto): void {
        this.missionDataSubject.next(data);
    }

    getMissionData(): IStartMissionDataDto | null {
        return this.missionDataSubject.value;
    }

    clearMissionData(): void {
        this.missionDataSubject.next(null);
    }
}



