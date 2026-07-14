import { useTheme } from '@app/store';
import { Theme } from '@app/types';

export const dispatchTheme = (theme: Theme): void => {
  useTheme.getState().setTheme(theme);
};
