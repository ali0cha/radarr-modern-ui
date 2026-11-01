import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { useAppStore } from 'App/useAppStore';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { invalidateHealth, useHealth } from 'System/useSystem';

function HealthStatus() {
  const queryClient = useQueryClient();
  const { isConnected, isReconnecting } = useAppStore();
  const { items } = useHealth();

  const wasReconnecting = usePrevious(isReconnecting);

  const { count, errors, warnings } = useMemo(() => {
    let errors = false;
    let warnings = false;

    items.forEach((item) => {
      if (item.type === 'error') {
        errors = true;
      }

      if (item.type === 'warning') {
        warnings = true;
      }
    });

    return {
      count: items.length,
      errors,
      warnings,
    };
  }, [items]);

  useEffect(() => {
    if (isConnected && wasReconnecting) {
      invalidateHealth(queryClient);
    }
  }, [isConnected, wasReconnecting, queryClient]);

  return (
    <PageSidebarStatus count={count} errors={errors} warnings={warnings} />
  );
}

export default HealthStatus;
