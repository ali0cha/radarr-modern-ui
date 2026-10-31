import React from 'react';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import Label from './Label';
import styles from './ImportListList.module.css';

interface ImportListListProps {
  lists: number[];
}

function ImportListList({ lists }: ImportListListProps) {
  const { items: allImportLists } = useImportLists();

  return (
    <div className={styles.lists}>
      {lists.map((id) => {
        const importList = allImportLists.find((list) => list.id === id);

        if (!importList) {
          return null;
        }

        return (
          <Label key={importList.id} kind="success" size="medium">
            {importList.name}
          </Label>
        );
      })}
    </div>
  );
}

export default ImportListList;
