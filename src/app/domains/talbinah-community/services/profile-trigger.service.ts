import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileTriggerService {
    // Use a BehaviorSubject to hold the trigger value
    // null initially, or you can use a default value if needed
    private _triggerProfileFetch = new BehaviorSubject<boolean | null>(null);

    // Expose it as an Observable for components to subscribe to
    // You might want to filter out `null` if you don't want the initial null to trigger
    triggerProfileFetch$: Observable<boolean | null> = this._triggerProfileFetch.asObservable();

    /**
     * Call this method from the component that wants to trigger the profile fetch.
     * @param disableLoadingValue The value for disableLoading (true in your case).
     */
    triggerFetchWithDisableLoading(disableLoadingValue: boolean): void {
        this._triggerProfileFetch.next(disableLoadingValue);
    }

    // Optional: If you need to clear the trigger or reset it
    clearTrigger(): void {
        this._triggerProfileFetch.next(null);
    }
}