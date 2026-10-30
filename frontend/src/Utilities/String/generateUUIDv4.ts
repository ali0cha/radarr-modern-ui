export default function generateUUIDv4() {
  return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) => {
    const n = Number(c);
    const random = crypto.getRandomValues(new Uint8Array(1))[0];

    /* eslint-disable no-bitwise */
    return (n ^ (random & (15 >> (n / 4)))).toString(16);
    /* eslint-enable no-bitwise */
  });
}
