import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { kinds } from 'Helpers/Props';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import {
  fetchDelayProfiles,
  fetchDownloadClients,
  fetchImportLists,
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

  // The indexers are listed in the details of a tag
  useIndexers();

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
    dispatch(fetchImportLists());
    dispatch(fetchNotifications());
    dispatch(fetchReleaseProfiles());
    dispatch(fetchDownloadClients());
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
