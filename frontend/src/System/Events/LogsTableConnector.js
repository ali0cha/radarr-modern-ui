import React, { useCallback, useEffect } from 'react';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import usePrevious from 'Helpers/Hooks/usePrevious';
import LogsTable from './LogsTable';
import { useLogs } from './useLogs';

function LogsTableConnector() {
  const {
    isFetching,
    isPopulated,
    error,
    items,
    columns,
    filters,
    selectedFilterKey,
    sortKey,
    sortDirection,
    page,
    pageSize,
    totalPages,
    totalRecords,
    handleFirstPagePress,
    handlePreviousPagePress,
    handleNextPagePress,
    handleLastPagePress,
    handlePageSelect,
    handleSortPress,
    handleFilterSelect,
    handleTableOptionChange,
    handleRefreshPress
  } = useLogs();

  const clearLogExecuting = useCommandExecuting(commandNames.CLEAR_LOGS);
  const wasClearLogExecuting = usePrevious(clearLogExecuting);

  useEffect(() => {
    if (wasClearLogExecuting && !clearLogExecuting) {
      handleRefreshPress();
    }
  }, [wasClearLogExecuting, clearLogExecuting, handleRefreshPress]);

  const handleClearLogsPress = useCallback(() => {
    executeCommand({
      name: commandNames.CLEAR_LOGS
    });
  }, []);

  return (
    <LogsTable
      isFetching={isFetching}
      isPopulated={isPopulated}
      error={error}
      items={items}
      columns={columns}
      filters={filters}
      selectedFilterKey={selectedFilterKey}
      sortKey={sortKey}
      sortDirection={sortDirection}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      totalRecords={totalRecords}
      clearLogExecuting={clearLogExecuting}
      onFirstPagePress={handleFirstPagePress}
      onPreviousPagePress={handlePreviousPagePress}
      onNextPagePress={handleNextPagePress}
      onLastPagePress={handleLastPagePress}
      onPageSelect={handlePageSelect}
      onSortPress={handleSortPress}
      onFilterSelect={handleFilterSelect}
      onTableOptionChange={handleTableOptionChange}
      onRefreshPress={handleRefreshPress}
      onClearLogsPress={handleClearLogsPress}
    />
  );
}

export default LogsTableConnector;
