import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export interface AppTheme {
  name: ThemeName;
  icon: string;
}

export type ThemeName = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private appTheme = signal<ThemeName>('light');

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  private themes: AppTheme[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
  ];

  public selectedTheme = computed(() =>
    this.themes.find((t) => t.name === this.appTheme())
  );

  getThemes() {
    return this.themes;
  }

  setTheme(theme: ThemeName) {
    this.appTheme.set(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
    this.setThemeInLocalStorage(theme);
  }

  setThemeInLocalStorage(theme: ThemeName) {
    localStorage.setItem('preffered-theme', theme);
  }

  getThemeFromLocalStorage(): ThemeName {
    return (localStorage.getItem('preffered-theme') as ThemeName) ?? 'light';
  }
}
