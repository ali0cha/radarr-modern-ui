import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { useQueueStatus } from '../useQueue';

function QueueStatus() {
  const { isConnected, isReconnecting } = useSelector(
    (state: AppState) => state.app
  );
  const { count, errors, warnings, refetch } = useQueueStatus();

  const wasReconnecting = usePrevious(isReconnecting);

  useEffect(() => {
    if (isConnected && wasReconnecting) {
      refetch();
    }
  }, [isConnected, wasReconnecting, refetch]);

  return (
    <PageSidebarStatus count={count} errors={errors} warnings={warnings} />
  );
}

export default QueueStatus;
