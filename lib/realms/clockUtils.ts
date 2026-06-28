export function secondsSinceMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  return (now.getTime() - midnight.getTime()) / 1000;
}

export function formatScientific(n: number, decimals = 2): string {
  if (n === 0) return "0";
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const coeff = n / Math.pow(10, exp);
  const expStr = exp
    .toString()
    .split("")
    .map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[parseInt(c)] ?? c)
    .join("");
  return `${coeff.toFixed(decimals)} × 10${expStr}`;
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}
