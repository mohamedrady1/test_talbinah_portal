// common/function/transfer-state.service.ts
import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TransferStateService {
  private readonly state = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  set<T>(key: string, value: T): void {
    if (isPlatformServer(this.platformId)) {
      this.state.set(makeStateKey<T>(key), value);
    }
  }

  get<T>(key: string): T | null {
    const stateKey = makeStateKey<T>(key);
    return this.state.hasKey(stateKey) ? this.state.get(stateKey, null as any) : null;
  }

  remove(key: string): void {
    this.state.remove(makeStateKey<any>(key));
  }
}
