import React from 'react';
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import { useProviderSchema } from 'Settings/useProviderSettings';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import translate from 'Utilities/String/translate';
import { AUTO_TAGGINGS_PATH } from '../useAutoTaggings';
import AddSpecificationItem from './AddSpecificationItem';
import styles from './AddSpecificationModalContent.module.css';

interface AddSpecificationModalContentProps {
  onSpecificationSelect: (specification: AutoTaggingSpecification) => void;
  onModalClose: () => void;
}

export default function AddSpecificationModalContent({
  onSpecificationSelect,
  onModalClose,
}: AddSpecificationModalContentProps) {
  const {
    data: schema,
    isFetching: isSchemaFetching,
    isSuccess: isSchemaPopulated,
    error: schemaError,
  } = useProviderSchema<AutoTaggingSpecification>(AUTO_TAGGINGS_PATH);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddCondition')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <Alert kind={kinds.DANGER}>{translate('AddConditionError')}</Alert>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <Alert kind={kinds.INFO}>
              <div>{translate('SupportedAutoTaggingProperties')}</div>
            </Alert>

            <div className={styles.specifications}>
              {schema.map((specification) => {
                return (
                  <AddSpecificationItem
                    key={specification.implementation}
                    specification={specification}
                    onSpecificationSelect={onSpecificationSelect}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}
