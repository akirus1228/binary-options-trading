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

  const year = time.toLocaleString("default", { year: "numeric" });
  const month = time.toLocaleString("default", { month: "short" });
  const day = time.toLocaleString("default", { day: "numeric" });

  const formatedDate = locale !== "en-US" ? `${day}-${month}-${year}` : `${month}-${day}-${year}`;
  
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
