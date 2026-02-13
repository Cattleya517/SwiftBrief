const LETTER_MAP: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17,
  I: 34, J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23,
  Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, W: 32, X: 30,
  Y: 31, Z: 33,
};

export function validateTaiwanId(id: string): boolean {
  if (!/^[A-Z]\d{9}$/.test(id)) return false;

  const letterValue = LETTER_MAP[id[0]];
  if (letterValue === undefined) return false;

  const n1 = Math.floor(letterValue / 10);
  const n2 = letterValue % 10;

  const digits = id.slice(1).split("").map(Number);

  const sum =
    n1 * 1 +
    n2 * 9 +
    digits[0] * 8 +
    digits[1] * 7 +
    digits[2] * 6 +
    digits[3] * 5 +
    digits[4] * 4 +
    digits[5] * 3 +
    digits[6] * 2 +
    digits[7] * 1 +
    digits[8] * 1;

  return sum % 10 === 0;
}
