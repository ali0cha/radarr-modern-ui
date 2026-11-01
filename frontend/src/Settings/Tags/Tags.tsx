import React, { useMemo } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { kinds } from 'Helpers/Props';
import { useDownloadClients } from 'Settings/DownloadClients/useDownloadClients';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import { useNotifications } from 'Settings/Notifications/useNotifications';
import { useDelayProfiles } from 'Settings/Profiles/Delay/useDelayProfiles';
import { useReleaseProfiles } from 'Settings/Profiles/Release/useReleaseProfiles';
import { useTagDetails, useTagsQuery } from 'Tags/useTags';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import Tag from './Tag';
import styles from './Tags.module.css';

function Tags() {
  // The import lists, indexers, download clients and notifications are listed
  // in the details of a tag
  useImportLists();
  useDelayProfiles();
  useReleaseProfiles();
  useIndexers();
  useDownloadClients();
  useNotifications();

  // The tags are refetched every time the page is opened.
  const {
    data: tags,
    isFetching,
    isSuccess: isPopulated,
    error,
  } = useTagsQuery({ refetchOnMount: 'always' });

  const {
    isFetching: isDetailsFetching,
    isSuccess: isDetailsPopulated,
    error: detailsError,
  } = useTagDetails();

  const items = useMemo(
    () => [...(tags ?? [])].sort(sortByProp('label')),
    [tags]
  );

  if (!items.length) {
    return (
      <Alert kind={kinds.INFO}>{translate('NoTagsHaveBeenAddedYet')}</Alert>
    );
  }

  return (
    <FieldSet legend={translate('Tags')}>
      <PageSectionContent
        errorMessage={translate('TagsLoadError')}
        error={error ?? detailsError ?? undefined}
        isFetching={isFetching || isDetailsFetching}
        isPopulated={isPopulated || isDetailsPopulated}
      >
        <div className={styles.tags}>
          {items.map((item) => {
            return <Tag key={item.id} {...item} />;
          })}
        </div>
      </PageSectionContent>
    </FieldSet>
  );
}

export default Tags;
