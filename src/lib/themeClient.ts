import { THEME_COOKIE_KEY, Theme } from '@app/types';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const writeThemeCookie = (theme: Theme): void => {
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=${ONE_YEAR_IN_SECONDS}`;
};

export const applyThemeAttribute = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
};
