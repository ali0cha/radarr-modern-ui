import { useEffect, useState } from 'react';
import useUISettings from 'Settings/UI/useUISettings';

const useTheme = (): 'dark' | 'light' => {
  const { theme } = useUISettings();
  const selectedTheme = theme ?? window.Radarr.theme;
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (selectedTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    return selectedTheme;
  });

  useEffect(() => {
    if (selectedTheme !== 'auto') {
      setResolvedTheme(selectedTheme);
      return;
    }

    const applySystemTheme = () => {
      setResolvedTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      );
    };

    applySystemTheme();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', applySystemTheme);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', applySystemTheme);
    };
  }, [selectedTheme]);

  return resolvedTheme;
};

export default useTheme;
