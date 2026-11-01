import React, { useEffect } from 'react';
import { useAppStore } from 'App/useAppStore';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { useQueueStatus } from '../useQueue';

function QueueStatus() {
  const { isConnected, isReconnecting } = useAppStore();
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
