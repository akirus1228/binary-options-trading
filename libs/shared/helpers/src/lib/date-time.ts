/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

export const formatDateTimeString = (time: Date, isOnlyDate = false) => {
  const locale = navigator.language;

  const year = time.toLocaleString("en-US", { year: "numeric" });
  const month = time.toLocaleString("en-US", { month: "short" });
  const day = time.toLocaleString("en-US", { day: "numeric" });

  const formatedDate =
    locale !== "en-US" ? `${day}-${month}-${year}` : `${month}-${day}-${year}`;

  return `${formatedDate}${
    isOnlyDate
      ? ""
      : ", " +
        time.getUTCHours() +
        ":" +
        time.getUTCMinutes() +
        ":" +
        time.getUTCSeconds() +
        " UTC"
  }`;
};
