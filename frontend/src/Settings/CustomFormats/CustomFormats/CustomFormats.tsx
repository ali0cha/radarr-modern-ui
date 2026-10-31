import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import CustomFormatModel from 'typings/CustomFormat';
import translate from 'Utilities/String/translate';
import {
  getClonedCustomFormat,
  NEW_CUSTOM_FORMAT,
  useCustomFormats,
} from '../useCustomFormats';
import CustomFormat from './CustomFormat';
import EditCustomFormatModal from './EditCustomFormatModal';
import styles from './CustomFormats.module.css';

function CustomFormats() {
  const { items, isFetching, isPopulated, error } = useCustomFormats();

  const [isCustomFormatModalOpen, setIsCustomFormatModalOpen] = useState(false);

  // The custom format that is edited when it is new: empty or a clone
  const [newCustomFormat, setNewCustomFormat] =
    useState<CustomFormatModel>(NEW_CUSTOM_FORMAT);

  const handleCloneCustomFormatPress = useCallback(
    (id: number) => {
      const customFormat = items.find((item) => item.id === id);

      if (customFormat) {
        setNewCustomFormat(getClonedCustomFormat(customFormat));
        setIsCustomFormatModalOpen(true);
      }
    },
    [items]
  );

  const handleEditCustomFormatPress = useCallback(() => {
    setNewCustomFormat(NEW_CUSTOM_FORMAT);
    setIsCustomFormatModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsCustomFormatModalOpen(false);
  }, []);

  return (
    <FieldSet legend={translate('CustomFormats')}>
      <PageSectionContent
        errorMessage={translate('CustomFormatsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.customFormats}>
          {items.map((item) => {
            return (
              <CustomFormat
                key={item.id}
                {...item}
                onCloneCustomFormatPress={handleCloneCustomFormatPress}
              />
            );
          })}

          <Card
            className={styles.addCustomFormat}
            onPress={handleEditCustomFormatPress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <EditCustomFormatModal
          isOpen={isCustomFormatModalOpen}
          defaultCustomFormat={newCustomFormat}
          onModalClose={handleModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default CustomFormats;
