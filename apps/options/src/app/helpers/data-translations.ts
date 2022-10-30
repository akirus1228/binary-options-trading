export const convertTime = (date: Date): string => {
  const result = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} 
  ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return result;
};

export const financialString = (x: string | number): string => {
  if (typeof x === "string") return Number.parseFloat(x).toFixed(2);
  else return x.toFixed(2);
};

export const formatFinancialString = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
