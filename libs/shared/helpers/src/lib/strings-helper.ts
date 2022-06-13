export const addressEllipsis = (address: string, length = 6): string => {
  if (!address) return "";
  return `${address.slice(0, length + 2)}...${address.slice(address.length - length)}`;
};
