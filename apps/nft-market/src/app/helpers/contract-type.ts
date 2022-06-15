import { addresses } from "@fantohm/shared-web3";
import { ethers } from "ethers";
import { desiredNetworkId } from "../constants/network";
import { TokenType } from "../types/backend-types";

export const ercType = async (
  contract: ethers.Contract
): Promise<TokenType | undefined> => {
  if (
    contract.address.toLowerCase() ===
    addresses[desiredNetworkId]["CRYPTOPUNKS_ADDRESS"].toLowerCase()
  )
    return TokenType.CRYPTO_PUNKS;
  const is721 = await contract["methods"].supportsInterface("0x80ac58cd").call();
  if (is721) {
    return TokenType.ERC721;
  }
  const is1155 = await contract["methods"].supportsInterface("0xd9b67a26").call();
  if (is1155) {
    return TokenType.ERC1155;
  }
  return undefined;
};
