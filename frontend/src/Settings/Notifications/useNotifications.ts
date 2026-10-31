import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import Notification from 'typings/Notification';
import sortByProp from 'Utilities/Array/sortByProp';

export const NOTIFICATIONS_PATH = '/notification';

export function useNotifications() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<Notification>(NOTIFICATIONS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

// The provider to edit when a new notification is added: the implementation,
// or one of its presets, with every event it supports turned on.
export function getNewNotification(
  implementation: Notification & { presets?: Notification[] },
  presetName?: string
): Notification {
  const { presets, ...schema } = implementation;
  const selected = presetName
    ? presets?.find((preset) => preset.name === presetName) ?? schema
    : schema;

  return {
    ...selected,
    name: presetName ?? implementation.implementationName,
    implementationName: implementation.implementationName,
    onGrab: selected.supportsOnGrab,
    onDownload: selected.supportsOnDownload,
    onUpgrade: selected.supportsOnUpgrade,
    onRename: selected.supportsOnRename,
    onMovieAdded: selected.supportsOnMovieAdded,
    onMovieDelete: selected.supportsOnMovieDelete,
    onMovieFileDelete: selected.supportsOnMovieFileDelete,
    onMovieFileDeleteForUpgrade: selected.supportsOnMovieFileDeleteForUpgrade,
    onApplicationUpdate: selected.supportsOnApplicationUpdate,
    onManualInteractionRequired: selected.supportsOnManualInteractionRequired,
  };
}
