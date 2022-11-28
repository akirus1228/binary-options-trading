import { TimeframeEnum } from "../core/constants/basic";

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

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const convertTimeString = (e: TimeframeEnum) => {
  let timeType: any;
  if (e < 10) timeType = "00:0" + e.toString() + ":00";
  else timeType = "00:" + e.toString() + ":00";
  return timeType;
};
