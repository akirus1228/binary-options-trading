import { ethers } from "ethers";
import { isDev } from ".";
import { cryptopunksAbi, erc1155Abi, ierc721Abi } from "../abi";
import { addresses } from "../constants";
import { NetworkIds } from "../networks";

export enum TokenType {
  ERC721,
  ERC1155,
  CRYPTO_PUNKS,
}

export const ercType = async (contract: ethers.Contract): Promise<TokenType> => {
  if (
    contract.address.toLowerCase() ===
    addresses[isDev ? NetworkIds.Rinkeby : NetworkIds.Ethereum][
      "CRYPTOPUNKS_ADDRESS"
    ].toLowerCase()
  ) {
    return TokenType.CRYPTO_PUNKS;
  }
  try {
    const is721 = await contract["methods"].supportsInterface("0x80ac58cd").call();
    if (is721) {
      return TokenType.ERC721;
    }
    const is1155 = await contract["methods"].supportsInterface("0xd9b67a26").call();
    if (is1155) {
      return TokenType.ERC1155;
    }
  } catch (err) {
    console.warn("Unable to determine contract type from address or interface");
  }

  return TokenType.ERC721;
};

export const getErc721Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
) => {
  const nftContract = new ethers.Contract(address, ierc721Abi, signer);
  return await nftContract["approve"](
    addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
    tokenId
  );
};

export const getErc1155Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string
) => {
  const nftContract = new ethers.Contract(address, erc1155Abi, signer);
  return await nftContract["setApprovalForAll"](
    addresses[networkId]["USDB_LENDING_ADDRESS"] as string
  );
};

export const getCryptopunksPermission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
) => {
  const nftContract = new ethers.Contract(address, cryptopunksAbi, signer);
  return await nftContract["offerPunkForSaleToAddress"](
    tokenId,
    0,
    addresses[networkId]["USDB_LENDING_ADDRESS"] as string
  );
};

export const checkErc721Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, ierc721Abi, signer);
  return await nftContract["approve"](
    addresses[networkId]["USDB_LENDING_ADDRESS"] as string,
    tokenId
  );
};

export const checkErc1155Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  ownerAddress: string,
  address: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, erc1155Abi, signer);
  return await nftContract["isApprovedForAll"](
    ownerAddress,
    addresses[networkId]["USDB_LENDING_ADDRESS"] as string
  );
};

export const checkCryptopunksPermission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, cryptopunksAbi, signer);
  // should return Offer(true, punkIndex, msg.sender, minSalePriceInWei, toAddress);
  return await nftContract["punksOfferedForSale"](tokenId);
};
