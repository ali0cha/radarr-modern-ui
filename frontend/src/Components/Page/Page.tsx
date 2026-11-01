import React, { useCallback, useEffect, useState } from 'react';
import AppUpdatedModal from 'App/AppUpdatedModal';
import ColorImpairedContext from 'App/ColorImpairedContext';
import ConnectionLostModal from 'App/ConnectionLostModal';
import { saveDimensions, useAppStore, useDimensions } from 'App/useAppStore';
import SignalRConnector from 'Components/SignalRConnector';
import AuthenticationRequiredModal from 'FirstRun/AuthenticationRequiredModal';
import useAppPage from 'Helpers/Hooks/useAppPage';
import useUISettings from 'Settings/UI/useUISettings';
import useSystemStatus from 'System/useSystemStatus';
import ErrorPage from './ErrorPage';
import PageHeader from './Header/PageHeader';
import LoadingPage from './LoadingPage';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.module.css';

interface PageProps {
  children: React.ReactNode;
}

function Page({ children }: PageProps) {
  const { hasError, errors, isPopulated, isLocalStorageSupported } =
    useAppPage();
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [isConnectionLostModalOpen, setIsConnectionLostModalOpen] =
    useState(false);

  const { enableColorImpairedMode } = useUISettings();
  const { isSmallScreen } = useDimensions();
  const { authentication } = useSystemStatus();
  const authenticationEnabled = authentication !== 'none';
  const { isSidebarVisible, isUpdated, isDisconnected, version } =
    useAppStore();

  const handleUpdatedModalClose = useCallback(() => {
    setIsUpdatedModalOpen(false);
  }, []);

  const handleResize = useCallback(() => {
    saveDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (isDisconnected) {
      setIsConnectionLostModalOpen(true);
    }
  }, [isDisconnected]);

  useEffect(() => {
    if (isUpdated) {
      setIsUpdatedModalOpen(true);
    }
  }, [isUpdated]);

  if (hasError || !isLocalStorageSupported) {
    return (
      <ErrorPage
        {...errors}
        version={version}
        isLocalStorageSupported={isLocalStorageSupported}
      />
    );
  }

  if (!isPopulated) {
    return <LoadingPage />;
  }

  return (
    <ColorImpairedContext.Provider value={enableColorImpairedMode}>
      <div className={styles.page}>
        <SignalRConnector />

        <PageHeader isSmallScreen={isSmallScreen} />

        <div className={styles.main}>
          <PageSidebar
            isSmallScreen={isSmallScreen}
            isSidebarVisible={isSidebarVisible}
          />

          {children}
        </div>

        <AppUpdatedModal
          isOpen={isUpdatedModalOpen}
          onModalClose={handleUpdatedModalClose}
        />

        <ConnectionLostModal isOpen={isConnectionLostModalOpen} />

        <AuthenticationRequiredModal isOpen={!authenticationEnabled} />
      </div>
    </ColorImpairedContext.Provider>
  );
}

export default Page;
