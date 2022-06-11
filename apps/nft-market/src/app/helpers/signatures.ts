import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Terms } from "../types/backend-types";
import { nftTokenType } from "../types/contract-types";

export const signTerms = async (
  provider: JsonRpcProvider,
  borrowerAddress: string,
  chainId: number,
  nftContractAddress: string,
  tokenId: string,
  term: Terms,
  currencyAddress: string
): Promise<string> => {
  console.log(`borrowerAddress ${borrowerAddress}`);
  console.log(`nftContractAddress ${nftContractAddress}`);
  console.log(`tokenId ${tokenId}`);
  console.log(`currencyAddress ${currencyAddress}`);
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
      currencyAddress,
      tokenId,
      term.duration,
      ethers.utils.parseEther(term.amount.toString()),
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
