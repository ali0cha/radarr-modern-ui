import { useLayoutEffect } from 'react';
import useTheme from 'Helpers/Hooks/useTheme';
import useUISettings from 'Settings/UI/useUISettings';

function ApplyTheme() {
  const theme = useTheme();
  const { enableColorImpairedMode } = useUISettings();

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    if (enableColorImpairedMode) {
      document.documentElement.dataset.colorImpaired = '';
    } else {
      delete document.documentElement.dataset.colorImpaired;
    }
  }, [enableColorImpairedMode]);

  return null;
}

export default ApplyTheme;
