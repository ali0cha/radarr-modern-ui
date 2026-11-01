import React from 'react';
import { createRoot } from 'react-dom/client';
import initializeSentry from 'Helpers/initializeSentry';
import App from './App/App';

import 'Diag/ConsoleApi';

export async function bootstrap() {
  initializeSentry();

  const container = document.getElementById('root');

  const root = createRoot(container!); // createRoot(container!) if you use TypeScript
  root.render(<App />);
}
