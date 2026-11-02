import React, {
  Children,
  isValidElement,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Align } from 'Helpers/Props/align';
import { InternalOverflowItem } from './Overflow';
import { ToolbarMoreButton, useToolbarRegistry } from './PageToolbar';
import { PageToolbarButtonProps } from './PageToolbarButton';
import PageToolbarSpacer from './PageToolbarSpacer';
import styles from './ToolbarItem.module.css';

export interface PageToolbarSectionProps {
  children?:
    | (ReactElement<PageToolbarButtonProps> | ReactElement<never> | null)
    | (ReactElement<PageToolbarButtonProps> | ReactElement<never> | null)[];
  alignContent?: Extract<Align, 'left' | 'center' | 'right'>;
  collapseButtons?: boolean;
}

interface SectionItemProps {
  id: string;
  element: ReactElement<PageToolbarButtonProps>;
  collapse: boolean;
}

// A button that moves to the overflow menu when the toolbar is too narrow.
function SectionButton({ id, element, collapse }: SectionItemProps) {
  const { register, unregister } = useToolbarRegistry();
  const { overflowComponent: OverflowComponent, ...buttonProps } =
    element.props;

  // The overflow component gets the props of the button when it is rendered
  const latestProps = useRef(element.props);
  latestProps.current = element.props;

  const renderOverflow = useCallback(() => {
    const Component = latestProps.current.overflowComponent;

    return Component ? <Component {...latestProps.current} /> : null;
  }, []);

  // Registering the same props again changes nothing, so this can run on
  // every render and the menu always has the latest props of the button.
  useEffect(() => {
    if (collapse) {
      register({
        ...buttonProps,
        id,
        label: buttonProps.label ?? '',
        renderOverflow: OverflowComponent ? renderOverflow : undefined,
      });
    } else {
      unregister(id);
    }
  });

  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, [unregister, id]);

  return (
    <InternalOverflowItem id={id} pinned={!collapse}>
      <div className={styles.slot}>{element}</div>
    </InternalOverflowItem>
  );
}

// Anything that is not a button (menus, separators) can't be in the overflow
// menu, so menus always stay and separators are the first to go.
function SectionOther({
  id,
  element,
  isSeparator,
}: {
  id: string;
  element: ReactElement;
  isSeparator: boolean;
}) {
  return (
    <InternalOverflowItem
      id={id}
      pinned={!isSeparator}
      priority={isSeparator ? -1 : undefined}
    >
      <div className={styles.slot}>{element}</div>
    </InternalOverflowItem>
  );
}

function PageToolbarSection({
  children,
  alignContent = 'left',
  collapseButtons = true,
}: PageToolbarSectionProps) {
  const elements = Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child)
  );

  return (
    <>
      {alignContent === 'right' ? (
        <>
          <ToolbarMoreButton />
          <PageToolbarSpacer />
        </>
      ) : null}

      {elements.map((element, index) => {
        const props = element.props as Partial<PageToolbarButtonProps>;
        const isSeparator = Object.keys(props).length === 0;
        const isButton =
          (!!props.label && !!props.iconName) || !!props.overflowComponent;
        const id = `${alignContent}-${index}-${
          isButton ? props.label : 'item'
        }`;

        if (isButton) {
          return (
            <SectionButton
              key={id}
              id={id}
              element={element as ReactElement<PageToolbarButtonProps>}
              collapse={collapseButtons}
            />
          );
        }

        return (
          <SectionOther
            key={id}
            id={id}
            element={element}
            isSeparator={isSeparator}
          />
        );
      })}
    </>
  );
}

export default PageToolbarSection;
