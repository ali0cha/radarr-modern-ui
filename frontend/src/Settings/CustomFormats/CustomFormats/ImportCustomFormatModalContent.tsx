import React, { useCallback, useEffect, useRef, useState } from 'react';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes, kinds, sizes } from 'Helpers/Props';
import { useProviderSchema } from 'Settings/useProviderSettings';
import { CustomFormatSpecification } from 'typings/CustomFormat';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { CUSTOM_FORMATS_PATH } from '../useCustomFormats';
import styles from './ImportCustomFormatModalContent.module.css';

interface ImportedSpecification {
  implementation: string;
  fields?: Record<string, unknown>;
  [key: string]: unknown;
}

// Builds the conditions of an imported custom format out of the schema of the
// conditions, and fails when it does not know one of them or of its options.
function parseSpecification(
  imported: ImportedSpecification,
  schema: CustomFormatSpecification[]
) {
  const implementation = schema.find(
    (item) => item.implementation === imported.implementation
  );

  if (!implementation) {
    throw new Error(
      translate('CustomFormatUnknownCondition', {
        implementation: imported.implementation,
      })
    );
  }

  const { presets, ...specification } =
    implementation as typeof implementation & {
      presets?: unknown;
    };

  let fields = specification.fields;

  Object.entries(imported).forEach(([key, value]) => {
    if (key === 'fields') {
      Object.entries(value as Record<string, unknown>).forEach(
        ([fieldName, fieldValue]) => {
          if (!fields.some((field) => field.name === fieldName)) {
            throw new Error(
              translate('CustomFormatUnknownConditionOption', {
                key: fieldName,
                implementation: implementation.implementationName,
              })
            );
          }

          fields = fields.map((field) =>
            field.name === fieldName
              ? { ...field, value: fieldValue as typeof field.value }
              : field
          );
        }
      );
    } else if (key !== 'id') {
      (specification as unknown as Record<string, unknown>)[key] = value;
    }
  });

  return { ...specification, fields } as CustomFormatSpecification;
}

export interface ImportCustomFormatModalContentProps {
  onImport: (
    values: Record<string, unknown>,
    specifications: CustomFormatSpecification[]
  ) => void;
  onModalClose: () => void;
}

function ImportCustomFormatModalContent({
  onImport,
  onModalClose,
}: ImportCustomFormatModalContentProps) {
  const {
    data: schema,
    isFetching,
    isSuccess: isPopulated,
    error,
  } = useProviderSchema<CustomFormatSpecification>(CUSTOM_FORMATS_PATH);

  const importTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [json, setJson] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [parseError, setParseError] = useState<{
    message: string;
    detailedMessage?: string;
  } | null>(null);

  const handleChange = useCallback(({ value }: InputChanged<string>) => {
    setJson(value);
  }, []);

  const doImport = useCallback(() => {
    try {
      const values: Record<string, unknown> = {};
      const specifications: CustomFormatSpecification[] = [];

      Object.entries(JSON.parse(json)).forEach(([key, value]) => {
        if (key === 'specifications') {
          (value as ImportedSpecification[]).forEach((specification) => {
            specifications.push(parseSpecification(specification, schema));
          });
        } else if (key !== 'id') {
          values[key] = value;
        }
      });

      onImport(values, specifications);
      setParseError(null);
      setIsSpinning(false);
      onModalClose();
    } catch (err) {
      const { message, stack } = err as Error;

      setParseError({ message, detailedMessage: stack });
      setIsSpinning(false);
    }
  }, [json, schema, onImport, onModalClose]);

  const handleImportPress = useCallback(() => {
    setIsSpinning(true);

    // this is a bodge as we need to register a isSpinning: true to get the spinner button to update
    importTimeout.current = setTimeout(doImport, 250);
  }, [doImport]);

  useEffect(() => {
    return () => {
      if (importTimeout.current) {
        clearTimeout(importTimeout.current);
      }
    };
  }, []);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('ImportCustomFormat')}</ModalHeader>

      <ModalBody>
        <div>
          {isFetching && !isPopulated ? <LoadingIndicator /> : null}

          {!isFetching && !!error ? (
            <Alert kind={kinds.DANGER}>
              {translate('CustomFormatsLoadError')}
            </Alert>
          ) : null}

          {isPopulated && !error ? (
            <Form>
              <FormGroup size={sizes.MEDIUM}>
                <FormLabel>{translate('CustomFormatJson')}</FormLabel>

                <FormInputGroup
                  key={0}
                  inputClassName={styles.input}
                  type={inputTypes.TEXT_AREA}
                  name="customFormatJson"
                  value={json}
                  placeholder={'{\n  "name": "Custom Format"\n}'}
                  errors={parseError ? [parseError] : []}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          ) : null}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          isSpinning={isSpinning}
          error={parseError?.message}
          onPress={handleImportPress}
        >
          {translate('Import')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default ImportCustomFormatModalContent;
