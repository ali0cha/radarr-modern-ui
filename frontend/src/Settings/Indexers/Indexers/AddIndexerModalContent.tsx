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
import Indexer from 'typings/Indexer';
import translate from 'Utilities/String/translate';
import { INDEXERS_PATH } from '../useIndexers';
import AddIndexerItem from './AddIndexerItem';
import styles from './AddIndexerModalContent.module.css';

interface AddIndexerModalContentProps {
  onIndexerSelect: (indexer: Indexer) => void;
  onModalClose: () => void;
}

function AddIndexerModalContent({
  onIndexerSelect,
  onModalClose,
}: AddIndexerModalContentProps) {
  const {
    data: schema,
    isFetching: isSchemaFetching,
    isSuccess: isSchemaPopulated,
    error: schemaError,
  } = useProviderSchema<Indexer>(INDEXERS_PATH);

  const { usenetIndexers, torrentIndexers } = useMemo(() => {
    return schema.reduce<{
      usenetIndexers: Indexer[];
      torrentIndexers: Indexer[];
    }>(
      (acc, item) => {
        if (item.protocol === 'usenet') {
          acc.usenetIndexers.push(item);
        } else if (item.protocol === 'torrent') {
          acc.torrentIndexers.push(item);
        }

        return acc;
      },
      {
        usenetIndexers: [],
        torrentIndexers: [],
      }
    );
  }, [schema]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddIndexer')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <Alert kind={kinds.DANGER}>{translate('AddIndexerError')}</Alert>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <Alert kind={kinds.INFO}>
              <div>{translate('SupportedIndexers')}</div>
              <div>{translate('SupportedIndexersMoreInfo')}</div>
            </Alert>

            <FieldSet legend={translate('Usenet')}>
              <div className={styles.indexers}>
                {usenetIndexers.map((indexer) => {
                  return (
                    <AddIndexerItem
                      key={indexer.implementation}
                      indexer={indexer}
                      onIndexerSelect={onIndexerSelect}
                    />
                  );
                })}
              </div>
            </FieldSet>

            <FieldSet legend={translate('Torrents')}>
              <div className={styles.indexers}>
                {torrentIndexers.map((indexer) => {
                  return (
                    <AddIndexerItem
                      key={indexer.implementation}
                      indexer={indexer}
                      onIndexerSelect={onIndexerSelect}
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

export default AddIndexerModalContent;
