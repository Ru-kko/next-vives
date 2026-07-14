import { create } from 'zustand';

import { DEFAULT_THEME, Theme } from '@app/types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: DEFAULT_THEME,
  setTheme: (theme) => set({ theme }),
}));
