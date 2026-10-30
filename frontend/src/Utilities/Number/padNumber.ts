function padNumber(
  input: number | string | null | undefined,
  width: number,
  paddingCharacter: number | string = 0
) {
  if (input == null) {
    return '';
  }

  const result = `${input}`;

  return result.length >= width
    ? result
    : new Array(width - result.length + 1).join(`${paddingCharacter}`) + result;
}

export default padNumber;
