import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useMovieCollection,
  useSaveMovieCollection,
} from 'Collection/useMovieCollections';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import { inputTypes } from 'Helpers/Props';
import MoviePoster from 'Movie/MoviePoster';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import selectSettings from 'Store/Selectors/selectSettings';
import { InputChanged } from 'typings/inputs';
import MovieCollection from 'typings/MovieCollection';
import translate from 'Utilities/String/translate';
import styles from './EditMovieCollectionModalContent.module.css';

export interface EditMovieCollectionModalContentProps {
  collectionId: number;
  onModalClose: () => void;
}

function EditMovieCollectionModalContent({
  collectionId,
  onModalClose,
}: EditMovieCollectionModalContentProps) {
  const collection = useMovieCollection(collectionId)!;

  const {
    title,
    overview,
    monitored,
    qualityProfileId,
    minimumAvailability,
    rootFolderPath,
    searchOnAdd,
    images,
    tags,
  } = collection;

  const { pendingChanges, setPendingChange } =
    usePendingChangesStore<MovieCollection>({});
  const { saveCollection, isSaving, saveError } = useSaveMovieCollection(
    collectionId,
    onModalClose
  );
  const { isSmallScreen } = useSelector(createDimensionsSelector());

  const { settings, ...otherSettings } = useMemo(() => {
    return selectSettings(
      {
        monitored,
        minimumAvailability,
        qualityProfileId,
        rootFolderPath,
        searchOnAdd,
        tags,
      },
      pendingChanges,
      saveError
    );
  }, [
    monitored,
    minimumAvailability,
    qualityProfileId,
    rootFolderPath,
    searchOnAdd,
    tags,
    pendingChanges,
    saveError,
  ]);

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      setPendingChange(
        name as keyof MovieCollection,
        value as MovieCollection[keyof MovieCollection]
      );
    },
    [setPendingChange]
  );

  const handleSavePress = useCallback(() => {
    saveCollection({ ...collection, ...pendingChanges });
  }, [collection, pendingChanges, saveCollection]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {translate('EditMovieCollectionModalHeader', { title })}
      </ModalHeader>

      <ModalBody>
        <div className={styles.container}>
          {isSmallScreen ? null : (
            <div className={styles.poster}>
              <MoviePoster
                className={styles.poster}
                images={images}
                size={250}
              />
            </div>
          )}

          <div className={styles.info}>
            <div className={styles.overview}>{overview}</div>

            <Form {...otherSettings}>
              <FormGroup>
                <FormLabel>{translate('Monitored')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="monitored"
                  helpText={translate('MonitoredCollectionHelpText')}
                  {...settings.monitored}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('MinimumAvailability')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.AVAILABILITY_SELECT}
                  name="minimumAvailability"
                  {...settings.minimumAvailability}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('QualityProfile')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.QUALITY_PROFILE_SELECT}
                  name="qualityProfileId"
                  {...settings.qualityProfileId}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('RootFolder')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.ROOT_FOLDER_SELECT}
                  name="rootFolderPath"
                  {...settings.rootFolderPath}
                  includeMissingValue={true}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('Tags')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.TAG}
                  name="tags"
                  {...settings.tags}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('SearchOnAdd')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="searchOnAdd"
                  helpText={translate('SearchOnAddCollectionHelpText')}
                  {...settings.searchOnAdd}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Form>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          error={saveError}
          isSpinning={isSaving}
          onPress={handleSavePress}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditMovieCollectionModalContent;
