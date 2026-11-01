import React, { useCallback, useEffect, useRef, useState } from 'react';
import Alert from 'Components/Alert';
import { PathInputInternal } from 'Components/Form/PathInput';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Scroller from 'Components/Scroller/Scroller';
import Column from 'Components/Table/Column';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { kinds, scrollDirections } from 'Helpers/Props';
import useSystemStatus from 'System/useSystemStatus';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import FileBrowserRow from './FileBrowserRow';
import usePaths, { PathsRequest } from './usePaths';
import styles from './FileBrowserModalContent.module.css';

const columns: Column[] = [
  {
    name: 'type',
    label: () => translate('Type'),
    isVisible: true,
  },
  {
    name: 'name',
    label: () => translate('Name'),
    isVisible: true,
  },
];

export interface FileBrowserModalContentProps {
  name: string;
  value: string;
  includeFiles?: boolean;
  onChange: (args: InputChanged<string>) => unknown;
  onModalClose: () => void;
}

function FileBrowserModalContent(props: FileBrowserModalContentProps) {
  const { name, value, includeFiles = true, onChange, onModalClose } = props;

  const { isWindows, mode } = useSystemStatus();

  const [currentPath, setCurrentPath] = useState(value);
  const [request, setRequest] = useState<PathsRequest | null>({
    path: value,
    allowFoldersWithoutTrailingSlashes: true,
    includeFiles,
  });
  const { isFetching, isPopulated, error, parent, directories, files, paths } =
    usePaths(request);
  const scrollerRef = useRef(null);
  const previousValue = usePrevious(value);

  const emptyParent = parent === '';
  const isWindowsService = isWindows && mode === 'service';

  const handlePathInputChange = useCallback(
    ({ value }: InputChanged<string>) => {
      setCurrentPath(value);
    },
    []
  );

  const handleRowPress = useCallback(
    (path: string) => {
      setCurrentPath(path);

      setRequest({
        path,
        allowFoldersWithoutTrailingSlashes: true,
        includeFiles,
      });
    },
    [includeFiles]
  );

  const handleOkPress = useCallback(() => {
    onChange({
      name,
      value: currentPath,
    });

    onModalClose();
  }, [name, currentPath, onChange, onModalClose]);

  const handleFetchPaths = useCallback(
    (path: string) => {
      setRequest({ path, includeFiles });
    },
    [includeFiles]
  );

  useEffect(() => {
    if (value !== previousValue && value !== currentPath) {
      setCurrentPath(value);
    }
  }, [value, previousValue, currentPath, setCurrentPath]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('FileBrowser')}</ModalHeader>

      <ModalBody
        className={styles.modalBody}
        scrollDirection={scrollDirections.NONE}
      >
        {isWindowsService ? (
          <Alert className={styles.mappedDrivesWarning} kind={kinds.WARNING}>
            <InlineMarkdown
              data={translate('MappedNetworkDrivesWindowsService', {
                url: 'https://wiki.servarr.com/radarr/faq#why-cant-radarr-see-my-files-on-a-remote-server',
              })}
            />
          </Alert>
        ) : null}

        <PathInputInternal
          className={styles.pathInput}
          placeholder={translate('FileBrowserPlaceholderText')}
          hasFileBrowser={false}
          includeFiles={includeFiles}
          paths={paths}
          name={name}
          value={currentPath}
          onChange={handlePathInputChange}
          onFetchPaths={handleFetchPaths}
        />

        <Scroller
          ref={scrollerRef}
          className={styles.scroller}
          scrollDirection="both"
        >
          {error ? <div>{translate('ErrorLoadingContents')}</div> : null}

          {isPopulated && !error ? (
            <Table horizontalScroll={false} columns={columns}>
              <TableBody>
                {emptyParent ? (
                  <FileBrowserRow
                    type="computer"
                    name={translate('MyComputer')}
                    path={parent}
                    onPress={handleRowPress}
                  />
                ) : null}

                {!emptyParent && parent ? (
                  <FileBrowserRow
                    type="parent"
                    name="..."
                    path={parent}
                    onPress={handleRowPress}
                  />
                ) : null}

                {directories.map((directory) => {
                  return (
                    <FileBrowserRow
                      key={directory.path}
                      type={directory.type}
                      name={directory.name}
                      path={directory.path}
                      onPress={handleRowPress}
                    />
                  );
                })}

                {files.map((file) => {
                  return (
                    <FileBrowserRow
                      key={file.path}
                      type={file.type}
                      name={file.name}
                      path={file.path}
                      onPress={handleRowPress}
                    />
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
        </Scroller>
      </ModalBody>

      <ModalFooter>
        {isFetching ? (
          <LoadingIndicator className={styles.loading} size={20} />
        ) : null}

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <Button onPress={handleOkPress}>{translate('Ok')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default FileBrowserModalContent;
