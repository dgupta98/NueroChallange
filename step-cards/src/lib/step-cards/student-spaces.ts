/**
 * A tablet can belong to one student in several classes ("spaces").
 * Each space holds its own device token. No account, no personal data.
 */
export interface StudentSpace {
  id: string;
  token: string;
  nickname: string;
  className: string;
  avatar: string;
  /** Favourite sticker book (category id), used for "Surprise me". */
  stickerTheme?: string | undefined;
}

const KEY = "stepCards_student_spaces_v2";
const LEGACY_KEY = "stepCards_student_device_v1";

export function spaceIdFor(studentId: string | undefined, token: string) {
  return studentId || token.slice(0, 16);
}

/** Add or replace a space. A re-joined class replaces its old entry, newest first. */
export function upsertSpace(list: StudentSpace[], space: StudentSpace): StudentSpace[] {
  return [space, ...list.filter((s) => s.id !== space.id)];
}

export function removeSpace(list: StudentSpace[], id: string): StudentSpace[] {
  return list.filter((s) => s.id !== id);
}

function read(): StudentSpace[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StudentSpace[];
    // Move a tablet set up before classes could be listed
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const d = JSON.parse(legacy) as Omit<StudentSpace, "id">;
      const list = [{ ...d, id: spaceIdFor(undefined, d.token) }];
      localStorage.setItem(KEY, JSON.stringify(list));
      localStorage.removeItem(LEGACY_KEY);
      return list;
    }
  } catch {
    // storage unavailable
  }
  return [];
}

function write(list: StudentSpace[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage unavailable
  }
}

export function loadSpaces() {
  return read();
}

export function loadSpace(id: string) {
  return read().find((s) => s.id === id) ?? null;
}

export function saveSpace(space: StudentSpace) {
  write(upsertSpace(read(), space));
}

export function updateSpace(id: string, patch: Partial<StudentSpace>) {
  write(read().map((s) => (s.id === id ? { ...s, ...patch } : s)));
}

export function forgetSpace(id: string) {
  write(removeSpace(read(), id));
}

/** Sign out of the whole tablet: forget every class. */
export function forgetAllSpaces() {
  write([]);
}
