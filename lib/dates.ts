const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateOnly(value: string) {
  const match = DATE_ONLY.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

export function formatDisplayDate(value: string | undefined) {
  if (!value) return "";

  if (DATE_ONLY.test(value)) {
    if (!isDateOnly(value)) return "";
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Vancouver",
  }).format(date);
}

export function dateInputValue(value: string | undefined) {
  if (!value) return "";
  if (isDateOnly(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function dateStamp(value: string | undefined) {
  if (!value) return 0;
  if (DATE_ONLY.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}
