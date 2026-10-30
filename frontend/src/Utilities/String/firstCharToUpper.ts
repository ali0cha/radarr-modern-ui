function firstCharToUpper(input?: string | null) {
  if (!input) {
    return '';
  }

  return input
    .split('')
    .map((char, i) => (i ? char : char.toUpperCase()))
    .join('');
}

export default firstCharToUpper;
