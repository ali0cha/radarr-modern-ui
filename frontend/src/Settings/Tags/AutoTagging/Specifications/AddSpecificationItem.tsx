import React, { useCallback } from 'react';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
import { getNewSpecification } from 'Settings/useSpecifications';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import translate from 'Utilities/String/translate';
import AddSpecificationPresetMenuItem from './AddSpecificationPresetMenuItem';
import styles from './AddSpecificationItem.module.css';

interface AddSpecificationItemProps {
  specification: AutoTaggingSpecification & {
    presets?: AutoTaggingSpecification[];
  };
  onSpecificationSelect: (specification: AutoTaggingSpecification) => void;
}

function AddSpecificationItem({
  specification,
  onSpecificationSelect,
}: AddSpecificationItemProps) {
  const { implementationName, infoLink, presets } = specification;
  const hasPresets = !!presets && !!presets.length;

  const handleSpecificationSelect = useCallback(() => {
    onSpecificationSelect(getNewSpecification(specification));
  }, [specification, onSpecificationSelect]);

  return (
    <div className={styles.specification}>
      <Link className={styles.underlay} onPress={handleSpecificationSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <span>
              <Button size={sizes.SMALL} onPress={handleSpecificationSelect}>
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddSpecificationPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        specification={specification}
                        onPress={onSpecificationSelect}
                      />
                    );
                  })}
                </MenuContent>
              </Menu>
            </span>
          )}

          {infoLink ? (
            <Button to={infoLink} size={sizes.SMALL}>
              {translate('MoreInfo')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddSpecificationItem;
