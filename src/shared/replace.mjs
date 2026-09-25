export function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

export function replaceExactlyOnce(text, original, replacement, label) {
  const count = countOccurrences(text, original);
  if (count !== 1) throw new Error(`Expected exactly one ${label}; found ${count}`);
  return text.replace(original, replacement);
}

export function assertCount(text, needle, expected, label) {
  const count = countOccurrences(text, needle);
  if (count !== expected) throw new Error(`Expected ${expected} ${label}; found ${count}`);
}
