import React from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import PageSectionContent from 'Components/Page/PageSectionContent';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import { icons, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import EditRemotePathMappingModal from './EditRemotePathMappingModal';
import RemotePathMapping from './RemotePathMapping';
import { useRemotePathMappings } from './useRemotePathMappings';
import styles from './RemotePathMappings.module.css';

function RemotePathMappings() {
  const { items, isFetching, isPopulated, error } = useRemotePathMappings();

  const [
    isAddRemotePathMappingModalOpen,
    setAddRemotePathMappingModalOpen,
    setAddRemotePathMappingModalClosed,
  ] = useModalOpenState(false);

  return (
    <FieldSet legend={translate('RemotePathMappings')}>
      <PageSectionContent
        errorMessage={translate('RemotePathMappingsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <Alert kind={kinds.INFO}>
          <InlineMarkdown
            data={translate('RemotePathMappingsInfo', {
              wikiLink:
                'https://wiki.servarr.com/radarr/settings#remote-path-mappings',
            })}
          />
        </Alert>

        <div className={styles.remotePathMappingsHeader}>
          <div className={styles.host}>{translate('Host')}</div>
          <div className={styles.path}>{translate('RemotePath')}</div>
          <div className={styles.path}>{translate('LocalPath')}</div>
        </div>

        <div>
          {items.map((item) => (
            <RemotePathMapping key={item.id} {...item} />
          ))}
        </div>

        <div className={styles.addRemotePathMapping}>
          <Link
            className={styles.addButton}
            onPress={setAddRemotePathMappingModalOpen}
          >
            <Icon name={icons.ADD} />
          </Link>
        </div>

        <EditRemotePathMappingModal
          isOpen={isAddRemotePathMappingModalOpen}
          onModalClose={setAddRemotePathMappingModalClosed}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default RemotePathMappings;
