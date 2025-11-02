import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { AppTheme } from '../../../shared';


@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'app-theme';
  private platformId = inject(PLATFORM_ID);

  private currentTheme = signal<AppTheme>(this.loadInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  get theme() {
    return this.currentTheme.asReadonly();
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark;
    this.setTheme(newTheme);
  }

  setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, theme);
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private loadInitialTheme(): AppTheme {
    if (isPlatformBrowser(this.platformId)) {
      return (localStorage.getItem(this.storageKey) as AppTheme) ?? 'light';
    }
    return AppTheme.Light; // Default to 'light' if not in a browser environment
  }
  getCurrentTheme(): AppTheme {
    return this.currentTheme();
  }
}
