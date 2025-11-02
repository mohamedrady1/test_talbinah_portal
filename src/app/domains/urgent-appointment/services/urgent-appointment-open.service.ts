import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UrgentAppointmentOpenService {
    public readonly openRequested$ = new BehaviorSubject<boolean>(false);

    requestOpen(): void {
        this.openRequested$.next(true);
    }

    consume(): void {
        this.openRequested$.next(false);
    }
}


