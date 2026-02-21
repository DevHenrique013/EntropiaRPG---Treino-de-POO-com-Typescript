export function enumValues<E extends Record<string, string | number>>(e: E): Array<E[keyof E]> {
  const vals = Object.values(e);
  const hasNumber = vals.some(v => typeof v === "number");
  return (hasNumber ? vals.filter(v => typeof v === "number") : vals) as Array<E[keyof E]>;
}