import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import MenuItem from 'Components/Menu/MenuItem';
import MenuItemSeparator from 'Components/Menu/MenuItemSeparator';
import { align, icons, kinds } from 'Helpers/Props';
import { shutdown, useRestart } from 'System/useSystem';
import useSystemStatus from 'System/useSystemStatus';
import translate from 'Utilities/String/translate';
import styles from './PageHeaderActionsMenu.module.css';

interface PageHeaderActionsMenuProps {
  onKeyboardShortcutsPress(): void;
}

function PageHeaderActionsMenu(props: PageHeaderActionsMenuProps) {
  const { onKeyboardShortcutsPress } = props;

  const restart = useRestart();

  const { authentication, isContainerized } = useSystemStatus();

  const showSignOut = authentication === 'forms' || authentication === 'oidc';

  const handleRestartPress = useCallback(() => {
    restart();
  }, [restart]);

  const handleShutdownPress = useCallback(() => {
    shutdown();
  }, []);

  return (
    <div>
      <Menu alignMenu={align.RIGHT}>
        <MenuButton className={styles.menuButton} aria-label="Menu Button">
          <Icon name={icons.INTERACTIVE} title={translate('Menu')} />
        </MenuButton>

        <MenuContent>
          <MenuItem onPress={onKeyboardShortcutsPress}>
            <Icon className={styles.itemIcon} name={icons.KEYBOARD} />
            {translate('KeyboardShortcuts')}
          </MenuItem>

          <MenuItemSeparator />

          <MenuItem onPress={handleRestartPress}>
            <Icon className={styles.itemIcon} name={icons.RESTART} />
            {translate('Restart')}
          </MenuItem>

          {isContainerized ? null : (
            <MenuItem onPress={handleShutdownPress}>
              <Icon
                className={styles.itemIcon}
                name={icons.SHUTDOWN}
                kind={kinds.DANGER}
              />
              {translate('Shutdown')}
            </MenuItem>
          )}

          {showSignOut ? (
            <>
              <MenuItemSeparator />

              <MenuItem to={`${window.Radarr.urlBase}/logout`} noRouter={true}>
                <Icon className={styles.itemIcon} name={icons.LOGOUT} />
                {translate('Logout')}
              </MenuItem>
            </>
          ) : null}
        </MenuContent>
      </Menu>
    </div>
  );
}

export default PageHeaderActionsMenu;
