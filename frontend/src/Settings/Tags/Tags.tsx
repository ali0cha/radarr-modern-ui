import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { kinds } from 'Helpers/Props';
import { useDownloadClients } from 'Settings/DownloadClients/useDownloadClients';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import {
  fetchDelayProfiles,
  fetchNotifications,
  fetchReleaseProfiles,
} from 'Store/Actions/settingsActions';
import { useTagDetails, useTagsQuery } from 'Tags/useTags';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import Tag from './Tag';
import styles from './Tags.module.css';

function Tags() {
  const dispatch = useDispatch();

  // The import lists, indexers and download clients are listed in the details
  // of a tag
  useImportLists();
  useIndexers();
  useDownloadClients();

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

  useEffect(() => {
    dispatch(fetchDelayProfiles());
    dispatch(fetchNotifications());
    dispatch(fetchReleaseProfiles());
  }, [dispatch]);

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
