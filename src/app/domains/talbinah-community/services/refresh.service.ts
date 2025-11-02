import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logger } from '../../../common';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  private _refreshTrigger = new BehaviorSubject<boolean>(false);

  public refreshTrigger$: Observable<boolean> = this._refreshTrigger.asObservable();
  constructor() { }

  /**
   * Call this method to signal that podcast data needs to be refreshed.
   * Components subscribing to refreshTrigger$ will react.
   */
  triggerRefresh(): void {
    // Emit 'true' to indicate a refresh, then immediately 'false'
    // to reset it, so subsequent 'true' emissions are treated as new events.
    this._refreshTrigger.next(true);
    this._refreshTrigger.next(false); // Reset for the next trigger
  }

}
