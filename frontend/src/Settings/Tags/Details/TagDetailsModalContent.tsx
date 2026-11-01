import React, { useMemo } from 'react';
import ModelBase from 'App/ModelBase';
import FieldSet from 'Components/FieldSet';
import Label from 'Components/Label';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import { useMovies } from 'Movie/useMovies';
import { useDownloadClients } from 'Settings/DownloadClients/useDownloadClients';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import { useNotifications } from 'Settings/Notifications/useNotifications';
import { useDelayProfiles } from 'Settings/Profiles/Delay/useDelayProfiles';
import { useReleaseProfiles } from 'Settings/Profiles/Release/useReleaseProfiles';
import { useAutoTaggings } from 'Settings/Tags/AutoTagging/useAutoTaggings';
import translate from 'Utilities/String/translate';
import TagDetailsDelayProfile from './TagDetailsDelayProfile';
import styles from './TagDetailsModalContent.module.css';

function findMatchingItems<T extends ModelBase>(ids: number[], items: T[]) {
  return items.filter((s) => {
    return ids.includes(s.id);
  });
}

export interface TagDetailsModalContentProps {
  label: string;
  isTagUsed: boolean;
  delayProfileIds: number[];
  importListIds: number[];
  notificationIds: number[];
  releaseProfileIds: number[];
  indexerIds: number[];
  downloadClientIds: number[];
  autoTagIds: number[];
  movieIds: number[];
  onModalClose: () => void;
  onDeleteTagPress: () => void;
}

function TagDetailsModalContent({
  label,
  isTagUsed,
  delayProfileIds = [],
  importListIds = [],
  notificationIds = [],
  releaseProfileIds = [],
  indexerIds = [],
  downloadClientIds = [],
  autoTagIds = [],
  movieIds = [],
  onModalClose,
  onDeleteTagPress,
}: TagDetailsModalContentProps) {
  const { movies: allMovies } = useMovies();
  const movies = useMemo(
    () =>
      findMatchingItems(movieIds, allMovies).sort((movieA, movieB) => {
        if (movieA.sortTitle > movieB.sortTitle) {
          return 1;
        } else if (movieA.sortTitle < movieB.sortTitle) {
          return -1;
        }

        return 0;
      }),
    [movieIds, allMovies]
  );

  const { defaultProfile, items: otherDelayProfiles } = useDelayProfiles();
  const delayProfiles = useMemo(
    () =>
      findMatchingItems(
        delayProfileIds,
        defaultProfile
          ? [defaultProfile, ...otherDelayProfiles]
          : otherDelayProfiles
      ),
    [delayProfileIds, defaultProfile, otherDelayProfiles]
  );

  const { items: allImportLists } = useImportLists();
  const importLists = useMemo(
    () => findMatchingItems(importListIds, allImportLists),
    [importListIds, allImportLists]
  );

  const { items: allNotifications } = useNotifications();
  const notifications = useMemo(
    () => findMatchingItems(notificationIds, allNotifications),
    [notificationIds, allNotifications]
  );

  const { items: allReleaseProfiles } = useReleaseProfiles();
  const releaseProfiles = useMemo(
    () => findMatchingItems(releaseProfileIds, allReleaseProfiles),
    [releaseProfileIds, allReleaseProfiles]
  );

  const { items: allIndexers } = useIndexers();
  const indexers = useMemo(
    () => findMatchingItems(indexerIds, allIndexers),
    [indexerIds, allIndexers]
  );

  const { items: allDownloadClients } = useDownloadClients();
  const downloadClients = useMemo(
    () => findMatchingItems(downloadClientIds, allDownloadClients),
    [downloadClientIds, allDownloadClients]
  );

  const { items: allAutoTags } = useAutoTaggings();
  const autoTags = useMemo(
    () => findMatchingItems(autoTagIds, allAutoTags),
    [autoTagIds, allAutoTags]
  );

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('TagDetails', { label })}</ModalHeader>

      <ModalBody>
        {!isTagUsed && <div>{translate('TagIsNotUsedAndCanBeDeleted')}</div>}

        {movies.length ? (
          <FieldSet legend={translate('Movies')}>
            {movies.map((item) => {
              return <div key={item.id}>{item.title}</div>;
            })}
          </FieldSet>
        ) : null}

        {delayProfiles.length ? (
          <FieldSet legend={translate('DelayProfile')}>
            {delayProfiles.map((item) => {
              const {
                id,
                preferredProtocol,
                enableUsenet,
                enableTorrent,
                usenetDelay,
                torrentDelay,
              } = item;

              return (
                <TagDetailsDelayProfile
                  key={id}
                  preferredProtocol={preferredProtocol}
                  enableUsenet={enableUsenet}
                  enableTorrent={enableTorrent}
                  usenetDelay={usenetDelay}
                  torrentDelay={torrentDelay}
                />
              );
            })}
          </FieldSet>
        ) : null}

        {notifications.length ? (
          <FieldSet legend={translate('Connections')}>
            {notifications.map((item) => {
              return <div key={item.id}>{item.name}</div>;
            })}
          </FieldSet>
        ) : null}

        {importLists.length ? (
          <FieldSet legend={translate('ImportLists')}>
            {importLists.map((item) => {
              return <div key={item.id}>{item.name}</div>;
            })}
          </FieldSet>
        ) : null}

        {releaseProfiles.length ? (
          <FieldSet legend={translate('ReleaseProfiles')}>
            {releaseProfiles.map((item) => {
              return (
                <div key={item.id} className={styles.restriction}>
                  <div>
                    {item.required.map((r) => {
                      return (
                        <Label key={r} kind={kinds.SUCCESS}>
                          {r}
                        </Label>
                      );
                    })}
                  </div>

                  <div>
                    {item.ignored.map((i) => {
                      return (
                        <Label key={i} kind={kinds.DANGER}>
                          {i}
                        </Label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </FieldSet>
        ) : null}

        {indexers.length ? (
          <FieldSet legend={translate('Indexers')}>
            {indexers.map((item) => {
              return <div key={item.id}>{item.name}</div>;
            })}
          </FieldSet>
        ) : null}

        {downloadClients.length ? (
          <FieldSet legend={translate('DownloadClients')}>
            {downloadClients.map((item) => {
              return <div key={item.id}>{item.name}</div>;
            })}
          </FieldSet>
        ) : null}

        {autoTags.length ? (
          <FieldSet legend={translate('AutoTagging')}>
            {autoTags.map((item) => {
              return <div key={item.id}>{item.name}</div>;
            })}
          </FieldSet>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button
          className={styles.deleteButton}
          kind={kinds.DANGER}
          title={
            isTagUsed ? translate('TagCannotBeDeletedWhileInUse') : undefined
          }
          isDisabled={isTagUsed}
          onPress={onDeleteTagPress}
        >
          {translate('Delete')}
        </Button>

        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default TagDetailsModalContent;
