import { cookies } from 'next/headers';

import { DEFAULT_THEME, THEME_COOKIE_KEY, Theme } from '@app/types';

import 'server-only';

export const getServerTheme = async (): Promise<Theme> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE_KEY)?.value;

  if (value === 'light' || value === 'dark') {
    return value;
  }

  return DEFAULT_THEME;
};
