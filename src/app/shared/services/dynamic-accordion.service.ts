import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { AccordionItem } from '../models';

@Injectable({ providedIn: 'root' })
export class AccordionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly item = signal<AccordionItem | null>(null);

  setItem(item: AccordionItem): void {
    if (isPlatformBrowser(this.platformId)) {
      this.item.set({ ...item, isOpen: item?.isOpen ?? false });
    }
  }

  toggleItem(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentItem = this.item();
      if (currentItem && currentItem.id === id) {
        this.item.set({ ...currentItem, isOpen: !currentItem?.isOpen });
      }
    }
  }

  getItem(): AccordionItem | null {
    return this.item();
  }
}
