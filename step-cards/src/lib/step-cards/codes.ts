/** Join codes use 6 characters from an alphabet without look-alikes (no 0/O, 1/I/L). */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function normalizeCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function isValidCode(code: string) {
  return code.length === 6 && [...code].every((c) => CODE_ALPHABET.includes(c));
}

/** Show "ABC 234" so codes are easier to read aloud and copy. */
export function formatCode(code: string) {
  return code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
}
