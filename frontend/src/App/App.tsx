import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Store } from 'redux';
import Page from 'Components/Page/Page';
import ApplyTheme from './ApplyTheme';
import { appRouteElements } from './AppRoutes';

interface AppProps {
  store: Store;
}

const queryClient = new QueryClient();

function PageLayout() {
  return (
    <>
      <ApplyTheme />
      <Page>
        <Outlet />
      </Page>
    </>
  );
}

const { urlBase } = window.Radarr;

// Everything is served below the url base. Requests for the bare root, which
// is outside of the router's basename, are sent to the url base.
if (urlBase && window.location.pathname === '/') {
  window.history.replaceState(
    null,
    '',
    `${urlBase}/${window.location.search}${window.location.hash}`
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageLayout />}>{appRouteElements()}</Route>
  ),
  { basename: urlBase || undefined }
);

function App({ store }: AppProps) {
  return (
    <DocumentTitle title={window.Radarr.instanceName}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </DocumentTitle>
  );
}

export default App;
