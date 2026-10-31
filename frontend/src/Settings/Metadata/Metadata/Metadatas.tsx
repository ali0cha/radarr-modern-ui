import React from 'react';
import FieldSet from 'Components/FieldSet';
import PageSectionContent from 'Components/Page/PageSectionContent';
import translate from 'Utilities/String/translate';
import Metadata from './Metadata';
import { useMetadata } from './useMetadata';
import styles from './Metadatas.module.css';

function Metadatas() {
  const { items, isFetching, isPopulated, error } = useMetadata();

  return (
    <FieldSet legend={translate('Metadata')}>
      <PageSectionContent
        isFetching={isFetching}
        isPopulated={isPopulated}
        error={error ?? undefined}
        errorMessage={translate('MetadataLoadError')}
      >
        <div className={styles.metadatas}>
          {items.map((item) => {
            return <Metadata key={item.id} {...item} />;
          })}
        </div>
      </PageSectionContent>
    </FieldSet>
  );
}

export default Metadatas;
