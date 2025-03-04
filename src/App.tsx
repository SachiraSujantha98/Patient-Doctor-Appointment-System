import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
