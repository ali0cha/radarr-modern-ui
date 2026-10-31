import React, { useMemo } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import { useProviderSchema } from 'Settings/useProviderSettings';
import DownloadClient from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import { DOWNLOAD_CLIENTS_PATH } from '../useDownloadClients';
import AddDownloadClientItem from './AddDownloadClientItem';
import styles from './AddDownloadClientModalContent.module.css';

interface AddDownloadClientModalContentProps {
  onDownloadClientSelect: (downloadClient: DownloadClient) => void;
  onModalClose: () => void;
}

function AddDownloadClientModalContent({
  onDownloadClientSelect,
  onModalClose,
}: AddDownloadClientModalContentProps) {
  const {
    data: schema,
    isFetching: isSchemaFetching,
    isSuccess: isSchemaPopulated,
    error: schemaError,
  } = useProviderSchema<DownloadClient>(DOWNLOAD_CLIENTS_PATH);

  const { usenetDownloadClients, torrentDownloadClients } = useMemo(() => {
    return schema.reduce<{
      usenetDownloadClients: DownloadClient[];
      torrentDownloadClients: DownloadClient[];
    }>(
      (acc, item) => {
        if (item.protocol === 'usenet') {
          acc.usenetDownloadClients.push(item);
        } else if (item.protocol === 'torrent') {
          acc.torrentDownloadClients.push(item);
        }

        return acc;
      },
      {
        usenetDownloadClients: [],
        torrentDownloadClients: [],
      }
    );
  }, [schema]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddDownloadClient')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <Alert kind={kinds.DANGER}>
            {translate('AddDownloadClientError')}
          </Alert>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <Alert kind={kinds.INFO}>
              <div>{translate('SupportedDownloadClients')}</div>
              <div>{translate('SupportedDownloadClientsMoreInfo')}</div>
            </Alert>

            <FieldSet legend={translate('Usenet')}>
              <div className={styles.downloadClients}>
                {usenetDownloadClients.map((downloadClient) => {
                  return (
                    <AddDownloadClientItem
                      key={downloadClient.implementation}
                      downloadClient={downloadClient}
                      onDownloadClientSelect={onDownloadClientSelect}
                    />
                  );
                })}
              </div>
            </FieldSet>

            <FieldSet legend={translate('Torrents')}>
              <div className={styles.downloadClients}>
                {torrentDownloadClients.map((downloadClient) => {
                  return (
                    <AddDownloadClientItem
                      key={downloadClient.implementation}
                      downloadClient={downloadClient}
                      onDownloadClientSelect={onDownloadClientSelect}
                    />
                  );
                })}
              </div>
            </FieldSet>
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AddDownloadClientModalContent;
