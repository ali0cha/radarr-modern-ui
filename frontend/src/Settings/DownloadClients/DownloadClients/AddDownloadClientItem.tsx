import React, { useCallback } from 'react';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
import DownloadClient from 'typings/DownloadClient';
import translate from 'Utilities/String/translate';
import { getNewDownloadClient } from '../useDownloadClients';
import AddDownloadClientPresetMenuItem from './AddDownloadClientPresetMenuItem';
import styles from './AddDownloadClientItem.module.css';

interface AddDownloadClientItemProps {
  downloadClient: DownloadClient & { presets?: DownloadClient[] };
  onDownloadClientSelect: (downloadClient: DownloadClient) => void;
}

function AddDownloadClientItem({
  downloadClient,
  onDownloadClientSelect,
}: AddDownloadClientItemProps) {
  const { implementationName, infoLink, presets } = downloadClient;
  const hasPresets = !!presets && !!presets.length;

  const handleDownloadClientSelect = useCallback(() => {
    onDownloadClientSelect(getNewDownloadClient(downloadClient));
  }, [downloadClient, onDownloadClientSelect]);

  return (
    <div className={styles.downloadClient}>
      <Link className={styles.underlay} onPress={handleDownloadClientSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <span>
              <Button size={sizes.SMALL} onPress={handleDownloadClientSelect}>
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddDownloadClientPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        downloadClient={downloadClient}
                        onPress={onDownloadClientSelect}
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

export default AddDownloadClientItem;
