import React, { useCallback, useEffect, useState } from 'react';
import { setIsSidebarVisible, useIsSidebarVisible } from 'App/useAppStore';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import MovieSearchInput from './MovieSearchInput';
import PageHeaderActionsMenu from './PageHeaderActionsMenu';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  isSmallScreen: boolean;
}

function PageHeader({ isSmallScreen }: PageHeaderProps) {
  const isSidebarVisible = useIsSidebarVisible();

  const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] =
    useState(false);

  const { bindShortcut, unbindShortcut } = useKeyboardShortcuts();

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarVisible({ isSidebarVisible: !isSidebarVisible });
  }, [isSidebarVisible]);

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
        <Link className={styles.logoLink} to="/">
          <img
            className={isSmallScreen ? styles.logo : styles.logoFull}
            src={
              isSmallScreen
                ? `${window.Radarr.urlBase}/Content/Images/logo.png`
                : `${window.Radarr.urlBase}/Content/Images/logo-full.png`
            }
            alt="Radarr Logo"
          />
        </Link>
      </div>

      <div className={styles.sidebarToggleContainer}>
        <IconButton
          id="sidebar-toggle-button"
          name={icons.NAVBAR_COLLAPSE}
          onPress={handleSidebarToggle}
        />
      </div>

      <MovieSearchInput />

      <div className={styles.right}>
        <IconButton
          className={styles.donate}
          name={icons.HEART}
          aria-label={translate('Donate')}
          to="https://radarr.video/donate"
          size={14}
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
