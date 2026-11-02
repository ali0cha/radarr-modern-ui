import React, {
  Children,
  createContext,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import ToolbarMenuButton from 'Components/Menu/ToolbarMenuButton';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import {
  Overflow,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from './Overflow';
import { PageToolbarButtonProps } from './PageToolbarButton';
import PageToolbarOverflowMenuItem from './PageToolbarOverflowMenuItem';
import styles from './PageToolbar.module.css';

export type MoreMenuItem = PageToolbarButtonProps & {
  id: string;
  priority?: number;
  renderOverflow?: (base: PageToolbarButtonProps) => ReactNode;
};

interface ToolbarRegistryContextValue {
  register: (item: MoreMenuItem) => void;
  unregister: (id: string) => void;
}

function shallowEqualMenuItem(a: MoreMenuItem, b: MoreMenuItem): boolean {
  const keys = Object.keys(a) as (keyof MoreMenuItem)[];

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  return keys.every((key) => key in b && a[key] === b[key]);
}

const ToolbarRegistryContext =
  createContext<ToolbarRegistryContextValue | null>(null);

// Kept apart from the registry, so that registering a button doesn't render
// every other button again.
const ToolbarItemsContext = createContext<MoreMenuItem[]>([]);

export function useToolbarRegistry() {
  const ctx = useContext(ToolbarRegistryContext);

  if (!ctx) {
    throw new Error('Toolbar items must be used inside <PageToolbar>');
  }

  return ctx;
}

interface PageToolbarProps extends PropsWithChildren {
  className?: string;
}

function PageToolbar({
  className = styles.toolbar,
  children,
}: PageToolbarProps) {
  const [registered, setRegistered] = useState<Record<string, MoreMenuItem>>(
    {}
  );

  const register = useCallback((item: MoreMenuItem) => {
    setRegistered((prev) => {
      const existing = prev[item.id];

      if (existing && shallowEqualMenuItem(existing, item)) {
        return prev;
      }

      return { ...prev, [item.id]: item };
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistered((prev) => {
      if (!(id in prev)) {
        return prev;
      }

      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Items are shown in the order they were registered in, which is the order
  // that they are rendered in.
  const items = useMemo(() => Object.values(registered), [registered]);

  const registry = useMemo(
    () => ({ register, unregister }),
    [register, unregister]
  );

  // A section that is aligned to the right renders the overflow button
  // before its spacer, without one it goes at the end of the toolbar.
  const hasRightSection = Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.props as { alignContent?: string }).alignContent === 'right'
  );

  return (
    <ToolbarRegistryContext.Provider value={registry}>
      <ToolbarItemsContext.Provider value={items}>
        <Overflow padding={40}>
          <div className={className}>
            {children}
            {hasRightSection ? null : <ToolbarMoreButton />}
          </div>
        </Overflow>
      </ToolbarItemsContext.Provider>
    </ToolbarRegistryContext.Provider>
  );
}

// Skips render when nothing overflows so the button stays out of the flex flow.
export function ToolbarMoreButton() {
  const items = useContext(ToolbarItemsContext);
  const { ref, isOverflowing } = useOverflowMenu<HTMLSpanElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <span ref={ref} className={styles.moreContainer}>
      <Menu>
        <ToolbarMenuButton
          className={styles.overflowMenuButton}
          iconName={icons.OVERFLOW}
          aria-label={translate('More')}
        />
        <MenuContent>
          {items.map((item) => (
            <OverflowMenuItemEntry key={item.id} item={item} />
          ))}
        </MenuContent>
      </Menu>
    </span>
  );
}

function OverflowMenuItemEntry({ item }: { item: MoreMenuItem }): ReactNode {
  const isVisible = useIsOverflowItemVisible(item.id);

  if (isVisible) {
    return null;
  }

  const { id: _id, priority: _priority, renderOverflow, ...rest } = item;

  return renderOverflow ? (
    renderOverflow(rest)
  ) : (
    <PageToolbarOverflowMenuItem {...rest} />
  );
}

export default PageToolbar;
