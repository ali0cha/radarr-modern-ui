import React, { useCallback } from 'react';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
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

          <Button to={infoLink} size={sizes.SMALL}>
            {translate('MoreInfo')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddImportListItem;
