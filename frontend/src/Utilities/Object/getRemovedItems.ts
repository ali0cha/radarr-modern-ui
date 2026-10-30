import ModelBase from 'App/ModelBase';

function getRemovedItems<T extends ModelBase>(
  prevItems: ReadonlyArray<T>,
  currentItems: ReadonlyArray<T>,
  idProp: keyof T = 'id'
) {
  if (prevItems === currentItems) {
    return [];
  }

  const currentItemIds = new Set();

  currentItems.forEach((currentItem) => {
    currentItemIds.add(currentItem[idProp]);
  });

  return prevItems.filter((prevItem) => !currentItemIds.has(prevItem[idProp]));
}

export default getRemovedItems;
