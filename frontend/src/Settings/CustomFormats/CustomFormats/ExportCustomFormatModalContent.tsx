import React, { useMemo } from 'react';
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import ClipboardButton from 'Components/Link/ClipboardButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import Field from 'typings/Field';
import translate from 'Utilities/String/translate';
import { useCustomFormats } from '../useCustomFormats';
import styles from './ExportCustomFormatModalContent.module.css';

const omittedProperties = ['id', 'implementationName', 'infoLink'];

function replacer(key: string, value: unknown) {
  if (omittedProperties.includes(key)) {
    return undefined;
  }

  // provider fields
  if (key === 'fields') {
    return (value as Field[]).reduce<Record<string, unknown>>((acc, cur) => {
      acc[cur.name] = cur.value;

      return acc;
    }, {});
  }

  return value;
}

interface ExportCustomFormatModalContentProps {
  id: number;
  onModalClose: () => void;
}

function ExportCustomFormatModalContent({
  id,
  onModalClose,
}: ExportCustomFormatModalContentProps) {
  const { items, isFetching, isPopulated, error } = useCustomFormats();

  const json = useMemo(() => {
    const customFormat = items.find((item) => item.id === id);

    return customFormat ? JSON.stringify(customFormat, replacer, 2) : '';
  }, [items, id]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('ExportCustomFormat')}</ModalHeader>

      <ModalBody>
        <div>
          {isFetching && !isPopulated ? <LoadingIndicator /> : null}

          {!isFetching && !!error ? (
            <Alert kind={kinds.DANGER}>
              {translate('CustomFormatsLoadError')}
            </Alert>
          ) : null}

          {isPopulated && !error ? (
            <div>
              <pre>{json}</pre>
            </div>
          ) : null}
        </div>
      </ModalBody>

      <ModalFooter>
        <ClipboardButton
          className={styles.button}
          value={json}
          title={translate('CopyToClipboard')}
          kind={kinds.DEFAULT}
        />

        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ExportCustomFormatModalContent;
