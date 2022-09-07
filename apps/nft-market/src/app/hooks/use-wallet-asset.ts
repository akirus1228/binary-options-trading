import { useWeb3Context } from "@fantohm/shared-web3";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Asset } from "../types/backend-types";
import { selectAssetByAddress } from "../store/selectors/asset-selectors";
import { useGetAssetsQuery } from "../api/backend-api";
import { useGetNftPortAssetQuery } from "../api/nftport";

export const useWalletAsset = (
  contractAddress: string,
  tokenId: string
): Asset | null => {
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, { tokenId, contractAddress })
  );
  const { address } = useWeb3Context();
  // load asset data from nftport
  const { data: npResponse, isLoading: isAssetLoading } = useGetNftPortAssetQuery(
    {
      token_id: tokenId,
      contract_address: contractAddress,
    },
    { skip: !!asset || !address }
  );

  useGetAssetsQuery(
    {
      skip: 0,
      take: 1,
      contractAddress,
      tokenId,
    },
    { skip: !npResponse || isAssetLoading || !authSignature }
  );

  return asset || ({} as Asset);
};
