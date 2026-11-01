import React, { useCallback, useEffect, useState } from 'react';
import { toggleIsSidebarVisible } from 'App/useAppStore';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import MovieSearchInput from './MovieSearchInput';
import PageHeaderActionsMenu from './PageHeaderActionsMenu';
import styles from './PageHeader.module.css';

function PageHeader() {
  const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] =
    useState(false);

  const { bindShortcut, unbindShortcut } = useKeyboardShortcuts();

  const handleSidebarToggle = useCallback(() => {
    toggleIsSidebarVisible();
  }, []);

  const handleOpenKeyboardShortcutsModal = useCallback(() => {
    setIsKeyboardShortcutsModalOpen(true);
  }, []);

  const handleKeyboardShortcutsModalClose = useCallback(() => {
    setIsKeyboardShortcutsModalOpen(false);
  }, []);

  useEffect(() => {
    bindShortcut(
      'openKeyboardShortcutsModal',
      handleOpenKeyboardShortcutsModal
    );

    return () => {
      unbindShortcut('openKeyboardShortcutsModal');
    };
  }, [handleOpenKeyboardShortcutsModal, bindShortcut, unbindShortcut]);

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <Link className={styles.logoLink} to="/" aria-label={translate('Home')}>
          <img
            className={styles.logo}
            src={`${window.Radarr.urlBase}/Content/Images/logo.svg`}
            alt=""
          />
          <span className={styles.brandName}>Radarr</span>
        </Link>
      </div>

      <div className={styles.sidebarToggleContainer}>
        <IconButton
          id="sidebar-toggle-button"
          className={styles.sidebarToggle}
          name={icons.NAVBAR_COLLAPSE}
          aria-label={translate('Menu')}
          onPress={handleSidebarToggle}
        />
      </div>

      <MovieSearchInput />

      <div className={styles.right}>
        <IconButton
          className={styles.donate}
          iconClassName={styles.donateIcon}
          name={icons.HEART}
          aria-label={translate('Donate')}
          to="https://radarr.video/donate"
          title={translate('Donate')}
        />

        <IconButton
          className={styles.translate}
          title={translate('SuggestTranslationChange')}
          name={icons.TRANSLATE}
          to="https://translate.servarr.com/projects/radarr/radarr/"
          size={24}
        />

        <PageHeaderActionsMenu
          onKeyboardShortcutsPress={handleOpenKeyboardShortcutsModal}
        />
      </div>

      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsModalOpen}
        onModalClose={handleKeyboardShortcutsModalClose}
      />
    </div>
  );
}

export default PageHeader;
