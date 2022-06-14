import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Terms } from "../types/backend-types";
import { nftTokenType } from "../types/contract-types";
import { Erc20Currency } from "./erc20Currency";

export const signTerms = async (
  provider: JsonRpcProvider,
  borrowerAddress: string,
  chainId: number,
  nftContractAddress: string,
  tokenId: string,
  term: Terms,
  currency: Erc20Currency
): Promise<string> => {
  const payload = ethers.utils.defaultAbiCoder.encode(
    [
      "address",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint8",
    ],
    [
      borrowerAddress,
      nftContractAddress,
      currency.currentAddress,
      tokenId,
      term.duration,
      ethers.utils.parseUnits(term.amount.toString(), currency.decimals),
      term.apr * 100,
      nftTokenType.ERC721,
    ]
  );

  const payloadHash = ethers.utils.keccak256(payload);
  const signature = await provider
    .getSigner()
    .signMessage(ethers.utils.arrayify(payloadHash));
  return signature;
};
