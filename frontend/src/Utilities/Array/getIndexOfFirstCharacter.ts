export default function getIndexOfFirstCharacter(
  items: ReadonlyArray<{ sortTitle: string }>,
  character: string
) {
  return items.findIndex((item) => {
    const firstCharacter = item.sortTitle.charAt(0);

    if (character === '#') {
      return !isNaN(Number(firstCharacter));
    }

    return firstCharacter === character;
  });
}
