import { dispatchTheme } from '@app/dispacher/theme';
import { applyThemeAttribute, writeThemeCookie } from '@app/lib';
import { useTheme } from '@app/store';
import { Theme } from '@app/types';

export const initTheme = (theme: Theme): void => {
  dispatchTheme(theme);
};

export const toggleTheme = (): void => {
  const current = useTheme.getState().theme;
  const next: Theme = current === 'dark' ? 'light' : 'dark';

  writeThemeCookie(next);
  applyThemeAttribute(next);
  dispatchTheme(next);
};
