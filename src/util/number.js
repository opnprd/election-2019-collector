export function makeNumber(value) {
  const number = parseInt(value);
  if (isNaN(number)) return undefined;
  return number;
}
