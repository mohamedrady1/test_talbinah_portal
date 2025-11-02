import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshUserPostsService {
  private _refreshUserPostsTrigger = new BehaviorSubject<boolean>(false);

  public _refreshUserPostsTrigger$: Observable<boolean> = this._refreshUserPostsTrigger.asObservable();
  constructor() { }

  /**
   * Call this method to signal that podcast data needs to be refreshed.
   * Components subscribing to _refreshUserPostsTrigger$ will react.
   */
  triggerRefresh(): void {
    // Emit 'true' to indicate a refresh, then immediately 'false'
    // to reset it, so subsequent 'true' emissions are treated as new events.
    this._refreshUserPostsTrigger.next(true);
    this._refreshUserPostsTrigger.next(false); // Reset for the next trigger
  }

}
