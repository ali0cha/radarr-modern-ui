import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { icons, sizes } from 'Helpers/Props';
import Indexer from 'typings/Indexer';
import translate from 'Utilities/String/translate';
import { getNewIndexer } from '../useIndexers';
import AddIndexerPresetMenuItem from './AddIndexerPresetMenuItem';
import styles from './AddIndexerItem.module.css';

interface AddIndexerItemProps {
  indexer: Indexer & { presets?: Indexer[] };
  onIndexerSelect: (indexer: Indexer) => void;
}

function AddIndexerItem({ indexer, onIndexerSelect }: AddIndexerItemProps) {
  const { implementationName, infoLink, presets } = indexer;
  const hasPresets = !!presets && !!presets.length;

  const handleIndexerSelect = useCallback(() => {
    onIndexerSelect(getNewIndexer(indexer));
  }, [indexer, onIndexerSelect]);

  return (
    <div className={styles.indexer}>
      <Link className={styles.underlay} onPress={handleIndexerSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <span>
              <Button size={sizes.SMALL} onPress={handleIndexerSelect}>
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddIndexerPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        indexer={indexer}
                        onPress={onIndexerSelect}
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

export default AddIndexerItem;
