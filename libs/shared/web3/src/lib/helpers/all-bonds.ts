import { StableBond, BondType, PaymentToken } from "../lib/bond";
import {NetworkIds} from "../networks";

import { singleSidedLPBondDepositoryAbi, tradFiBondDepositoryAbi, lqdrUsdbPolBondDepositoryAbi } from "../abi";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const TRADFI_3M = "tradfi3month";

export const tradfi3month = new StableBond({
  name: TRADFI_3M,
  type: BondType.TRADFI,
  displayName: "TradFi 3 Month",
  bondToken: "tradfi3month",
  decimals: 18,
  apr: 20,
  apy: 21.55,
  roi: 5,
  days: 90,
  isAvailable: { [NetworkIds.Ethereum]: true, [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.Ethereum]: {
      bondAddress: "0xCD8A46dC7EE4488b441Ae1CD3b5BCa48d5389C12",
      reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xEFbe7fe9E8b407a3F0C0451E7669E70cDD0C4C77",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xd7686f04D8c72054Bbc934ED951C919A87833C49",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const tradfi6month = new StableBond({
  name: "tradfi6month",
  type: BondType.TRADFI,
  displayName: "TradFi 6 Month",
  bondToken: "tradfi6month",
  decimals: 18,
  apr: 30,
  apy: 32.5,
  roi: 15,
  days: 180,
  isAvailable: { [NetworkIds.Ethereum]: true, [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.Ethereum]: {
      bondAddress: "0xD9fDd86ecc03e34DAf9c645C40DF670406836816",
      reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xB1c77436BC180009709Be00C9e852246476321A3",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xD3e73Cc8C42dAfAB204d1F2ef3C7b853AaF0B094",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const singleSided = new StableBond({
  name: "singleSided",
  type: BondType.SINGLE_SIDED,
  displayName: "Staking",
  bondToken: "singleSided",
  decimals: 18,
  apr: 0,
  roi: 20,
  days: 0,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: singleSidedLPBondDepositoryAbi,
  paymentToken: PaymentToken.FHM,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x8D36B8484459753a346e4274821EdBC6DeA39F3f",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const lqdrUsdbPol = new StableBond({
  name: "lqdrUsdbPol",
  type: BondType.LQDR_USDB_POL,
  displayName: "LQDR USDB Pol",
  bondToken: "lqdrUsdbPol",
  decimals: 18,
  apr: 0,
  roi: 0,
  days: 0,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: lqdrUsdbPolBondDepositoryAbi,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x4f06EC6079BB6F6B39aF11010d764f1B4747E3eC",
      reserveAddress: "0xf03b216dfc70008442e6f56ac085c18210b740f5",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  /// 1,1 stablecoin bonds
  // FTM
  tradfi3month,
  tradfi6month,
  singleSided,
  lqdrUsdbPol
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
