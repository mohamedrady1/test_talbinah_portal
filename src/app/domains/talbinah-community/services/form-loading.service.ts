import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormLoadingService {
    // BehaviorSubject will hold the loading state.
    // Initial value is false (meaning not loading).
    private _isFormLoading = new BehaviorSubject<boolean>(false);

    // This Observable allows other components to subscribe and receive updates,
    // but they cannot directly modify the value.
    isFormLoading$: Observable<boolean> = this._isFormLoading.asObservable();

    // Method to update the loading state.
    setFormLoading(isLoading: boolean): void {
        this._isFormLoading.next(isLoading);
    }

    // Method to get the current loading value.
    getCurrentFormLoading(): boolean {
        return this._isFormLoading.value;
    }
}