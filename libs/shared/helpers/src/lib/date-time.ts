/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

export const formatDateTimeString = (time: Date, isOnlyDate = false) => {
  const year = time.toLocaleString("default", { year: "2-digit" });
  const month = time.toLocaleString("default", { month: "short" });
  const day = time.toLocaleString("default", { day: "numeric" });
  return `${day}-${month}-${year}${isOnlyDate ? "" : ", " + time.toUTCString()}`;
};
