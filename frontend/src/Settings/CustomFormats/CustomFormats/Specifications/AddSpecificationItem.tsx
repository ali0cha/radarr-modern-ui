import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import { getNewSpecification } from 'Settings/useSpecifications';
import { CustomFormatSpecification } from 'typings/CustomFormat';
import translate from 'Utilities/String/translate';
import AddSpecificationPresetMenuItem from './AddSpecificationPresetMenuItem';
import styles from './AddSpecificationItem.module.css';

interface AddSpecificationItemProps {
  specification: CustomFormatSpecification & {
    presets?: CustomFormatSpecification[];
  };
  onSpecificationSelect: (specification: CustomFormatSpecification) => void;
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

          <Link
            className={styles.infoLink}
            to={infoLink}
            title={translate('MoreInfo')}
            aria-label={translate('MoreInfo')}
          >
            <Icon name={icons.INFO} size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddSpecificationItem;
