import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import ImportList from 'typings/ImportList';
import translate from 'Utilities/String/translate';
import { getNewImportList } from '../useImportLists';
import AddImportListPresetMenuItem from './AddImportListPresetMenuItem';
import styles from './AddImportListItem.module.css';

interface AddImportListItemProps {
  importList: ImportList & { presets?: ImportList[] };
  onImportListSelect: (importList: ImportList) => void;
}

function AddImportListItem({
  importList,
  onImportListSelect,
}: AddImportListItemProps) {
  const { implementationName, infoLink, presets } = importList;
  const hasPresets = !!(presets && presets.length);

  const handleImportListSelect = useCallback(() => {
    onImportListSelect(getNewImportList(importList));
  }, [importList, onImportListSelect]);

  return (
    <div className={styles.list}>
      <Link className={styles.underlay} onPress={handleImportListSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <span>
              <Button size={sizes.SMALL} onPress={handleImportListSelect}>
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddImportListPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        importList={importList}
                        onPress={onImportListSelect}
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

export default AddImportListItem;
