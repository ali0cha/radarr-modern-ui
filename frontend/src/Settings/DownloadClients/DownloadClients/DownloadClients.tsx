import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import DownloadClientModel from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import { useDownloadClients } from '../useDownloadClients';
import AddDownloadClientModal from './AddDownloadClientModal';
import DownloadClient from './DownloadClient';
import EditDownloadClientModal from './EditDownloadClientModal';
import styles from './DownloadClients.module.css';

function DownloadClients() {
  const { items, isFetching, isPopulated, error } = useDownloadClients();

  const [isAddDownloadClientModalOpen, setIsAddDownloadClientModalOpen] =
    useState(false);
  const [isEditDownloadClientModalOpen, setIsEditDownloadClientModalOpen] =
    useState(false);

  // The download client that is edited when it is new: a chosen implementation
  const [newDownloadClient, setNewDownloadClient] = useState<
    DownloadClientModel | undefined
  >();

  const handleAddDownloadClientPress = useCallback(() => {
    setIsAddDownloadClientModalOpen(true);
  }, []);

  const handleDownloadClientSelect = useCallback(
    (downloadClient: DownloadClientModel) => {
      setNewDownloadClient(downloadClient);
      setIsAddDownloadClientModalOpen(false);
      setIsEditDownloadClientModalOpen(true);
    },
    []
  );

  const handleAddDownloadClientModalClose = useCallback(() => {
    setIsAddDownloadClientModalOpen(false);
  }, []);

  const handleEditDownloadClientModalClose = useCallback(() => {
    setIsEditDownloadClientModalOpen(false);
  }, []);

  return (
    <FieldSet legend={translate('DownloadClients')}>
      <PageSectionContent
        errorMessage={translate('DownloadClientsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.downloadClients}>
          {items.map((item) => {
            return <DownloadClient key={item.id} {...item} />;
          })}

          <Card
            className={styles.addDownloadClient}
            onPress={handleAddDownloadClientPress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddDownloadClientModal
          isOpen={isAddDownloadClientModalOpen}
          onDownloadClientSelect={handleDownloadClientSelect}
          onModalClose={handleAddDownloadClientModalClose}
        />

        <EditDownloadClientModal
          isOpen={isEditDownloadClientModalOpen}
          defaultDownloadClient={newDownloadClient}
          onModalClose={handleEditDownloadClientModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default DownloadClients;
