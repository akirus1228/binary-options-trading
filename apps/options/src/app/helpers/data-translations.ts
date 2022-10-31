export const convertTime = (props: Date): { time: string; date: string } => {
  const time = `${props.getHours()}:${props.getMinutes()}:${props.getSeconds()}`;
  const date = `${props.getDate()}-${props.getMonth() + 1}-${props.getFullYear() - 2000}`;
  return { time, date };
};

export const fixedFloatString = (x: string | number): string => {
  if (typeof x === "string") return Number.parseFloat(x).toFixed(2);
  else return x.toFixed(2);
};

export const financialFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
