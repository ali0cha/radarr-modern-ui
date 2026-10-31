import React from 'react';
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import { useProviderSchema } from 'Settings/useProviderSettings';
import { CustomFormatSpecification } from 'typings/CustomFormat';
import translate from 'Utilities/String/translate';
import { CUSTOM_FORMATS_PATH } from '../../useCustomFormats';
import AddSpecificationItem from './AddSpecificationItem';
import styles from './AddSpecificationModalContent.module.css';

interface AddSpecificationModalContentProps {
  onSpecificationSelect: (specification: CustomFormatSpecification) => void;
  onModalClose: () => void;
}

function AddSpecificationModalContent({
  onSpecificationSelect,
  onModalClose,
}: AddSpecificationModalContentProps) {
  const {
    data: schema,
    isFetching: isSchemaFetching,
    isSuccess: isSchemaPopulated,
    error: schemaError,
  } = useProviderSchema<CustomFormatSpecification>(CUSTOM_FORMATS_PATH);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>Add Condition</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <Alert kind={kinds.DANGER}>{translate('AddConditionError')}</Alert>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <Alert kind={kinds.INFO}>
              <div>{translate('SupportedCustomConditions')}</div>

              <div>
                {translate('VisitTheWikiForMoreDetails')}
                <Link to="https://wiki.servarr.com/radarr/settings#custom-formats-2">
                  {translate('Wiki')}
                </Link>
              </div>
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

export default AddSpecificationModalContent;
