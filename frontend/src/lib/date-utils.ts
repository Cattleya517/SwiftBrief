export function toMinguoDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `民國${year}年${month}月${day}日`;
}

export function splitMinguoDate(dateStr: string): { yearPart: string; dayPart: string } | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const year = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { yearPart: `民國${year}年`, dayPart: `${month}月${day}日` };
}

export function getTodayMinguo(): string {
  const now = new Date();
  const year = now.getFullYear() - 1911;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `民國${year}年${month}月${day}日`;
}
