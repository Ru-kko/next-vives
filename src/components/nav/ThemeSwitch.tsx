'use client';

import { KeyboardEvent, ReactElement, useEffect } from 'react';

import { initTheme, toggleTheme } from '@app/actions/theme';
import { MoonIcon, SunIcon } from '@app/components/icons';
import { useTheme } from '@app/store';
import { Theme } from '@app/types';

import styles from './themeSwitch.module.css';

interface ThemeSwitchProps {
  theme: Theme;
}

export const ThemeSwitch = ({ theme }: ThemeSwitchProps): ReactElement => {
  useEffect(() => {
    initTheme(theme);
  }, [theme]);

  const { theme: activeTheme } = useTheme();
  const isLight = activeTheme === 'light';

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Toggle color theme"
      className={styles.track}
      data-active-theme={activeTheme}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.knob} />
      <SunIcon
        color={isLight ? 'text' : 'text-secondary'}
        className={`${styles.icon} ${styles.sun}`}
      />
      <MoonIcon
        color='surface'
        className={`${styles.icon} ${styles.moon}`}
      />
    </button>
  );
};
