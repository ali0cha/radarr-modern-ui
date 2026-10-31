import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import { icons, kinds } from 'Helpers/Props';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import translate from 'Utilities/String/translate';
import EditSpecificationModal from './EditSpecificationModal';
import styles from './Specification.module.css';

interface SpecificationProps {
  specification: AutoTaggingSpecification;
  onSave: (specification: AutoTaggingSpecification) => void;
  onConfirmDeleteSpecification: (specId: number) => void;
  onCloneSpecificationPress: (specId: number) => void;
}

export default function Specification({
  specification,
  onSave,
  onConfirmDeleteSpecification,
  onCloneSpecificationPress,
}: SpecificationProps) {
  const { id, implementationName, name, required, negate } = specification;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onEditPress = useCallback(() => {
    setIsEditModalOpen(true);
  }, [setIsEditModalOpen]);

  const onEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, [setIsEditModalOpen]);

  const onDeletePress = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(true);
  }, [setIsEditModalOpen, setIsDeleteModalOpen]);

  const onDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, [setIsDeleteModalOpen]);

  const onConfirmDelete = useCallback(() => {
    onConfirmDeleteSpecification(id);
  }, [id, onConfirmDeleteSpecification]);

  const onClonePress = useCallback(() => {
    onCloneSpecificationPress(id);
  }, [id, onCloneSpecificationPress]);

  return (
    <Card
      className={styles.autoTagging}
      overlayContent={true}
      onPress={onEditPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <IconButton
          className={styles.cloneButton}
          title={translate('Clone')}
          name={icons.CLONE}
          onPress={onClonePress}
        />
      </div>

      <div className={styles.labels}>
        <Label kind={kinds.DEFAULT}>{implementationName}</Label>

        {negate ? (
          <Label kind={kinds.DANGER}>{translate('Negated')}</Label>
        ) : null}

        {required ? (
          <Label kind={kinds.SUCCESS}>{translate('Required')}</Label>
        ) : null}
      </div>

      <EditSpecificationModal
        isOpen={isEditModalOpen}
        specification={specification}
        onSave={onSave}
        onModalClose={onEditModalClose}
        onDeleteSpecificationPress={onDeletePress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteSpecification')}
        message={translate('DeleteSpecificationHelpText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={onConfirmDelete}
        onCancel={onDeleteModalClose}
      />
    </Card>
  );
}
