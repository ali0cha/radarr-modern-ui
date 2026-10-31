import React, { useCallback, useRef, useState } from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import { icons } from 'Helpers/Props';
import SettingsToolbar from 'Settings/SettingsToolbar';
import { useTestAllProviders } from 'Settings/useProviderSettings';
import {
  SaveCallback,
  SettingsStateChange,
} from 'typings/Settings/SettingsState';
import translate from 'Utilities/String/translate';
import ImportListExclusions from './ImportListExclusions/ImportListExclusions';
import ImportLists from './ImportLists/ImportLists';
import ManageImportListsModal from './ImportLists/Manage/ManageImportListsModal';
import ImportListOptions from './Options/ImportListOptions';
import { IMPORT_LISTS_PATH } from './useImportLists';

function ImportListSettings() {
  const { testAll, isTestingAll } = useTestAllProviders(IMPORT_LISTS_PATH);

  const saveOptions = useRef<() => void>();

  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isManageImportListsModalOpen, setIsManageImportListsModalOpen] =
    useState(false);

  const handleSetChildSave = useCallback((saveCallback: SaveCallback) => {
    saveOptions.current = saveCallback;
  }, []);

  const handleChildStateChange = useCallback(
    ({ isSaving, hasPendingChanges }: SettingsStateChange) => {
      setIsSaving(isSaving);
      setHasPendingChanges(hasPendingChanges);
    },
    []
  );

  const handleManageImportListsPress = useCallback(() => {
    setIsManageImportListsModalOpen(true);
  }, []);

  const handleManageImportListsModalClose = useCallback(() => {
    setIsManageImportListsModalOpen(false);
  }, []);

  const handleSavePress = useCallback(() => {
    saveOptions.current?.();
  }, []);

  return (
    <PageContent title={translate('ImportListSettings')}>
      <SettingsToolbar
        isSaving={isSaving}
        hasPendingChanges={hasPendingChanges}
        additionalButtons={
          <>
            <PageToolbarSeparator />

            <PageToolbarButton
              label={translate('TestAllLists')}
              iconName={icons.TEST}
              isSpinning={isTestingAll}
              onPress={testAll}
            />

            <PageToolbarButton
              label={translate('ManageLists')}
              iconName={icons.MANAGE}
              onPress={handleManageImportListsPress}
            />
          </>
        }
        onSavePress={handleSavePress}
      />

      <PageContentBody>
        <ImportLists />

        <ImportListOptions
          setChildSave={handleSetChildSave}
          onChildStateChange={handleChildStateChange}
        />

        <ImportListExclusions />

        <ManageImportListsModal
          isOpen={isManageImportListsModalOpen}
          onModalClose={handleManageImportListsModalClose}
        />
      </PageContentBody>
    </PageContent>
  );
}

export default ImportListSettings;
