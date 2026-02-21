export function chance(p: number): boolean {
  return Math.random() < p;
}

export function pickOne<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickManyUnique<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function pickOneOrThrow<T>(arr: readonly T[], msg = "Array vazio"): T {
  if (arr.length === 0) throw new Error(msg);
  return arr[Math.floor(Math.random() * arr.length)];
}
