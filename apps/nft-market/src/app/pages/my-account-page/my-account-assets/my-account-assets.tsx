import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetListingsQuery, useGetLoansQuery } from "../../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../../api/opensea";
import AssetList from "../../../components/asset-list/asset-list";
import { RootState } from "../../../store";
import { OpenseaAssetQueryParam } from "../../../store/reducers/interfaces";
import { selectAssetsByQuery } from "../../../store/selectors/asset-selectors";
import {
  Asset,
  AssetStatus,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  FrontendAssetFilterQuery,
  LoanStatus,
} from "../../../types/backend-types";
import "./my-account-assets.module.scss";

export interface MyAccountAssetsProps {
  address: string;
}

export function MyAccountAssets({ address }: MyAccountAssetsProps) {
  // query to pass to opensea to pull data
  const [osQuery, setOsQuery] = useState<OpenseaAssetQueryParam>({
    limit: 50,
    owner: address,
  });

  // query to use on frontend to filter cached results and ultimately display
  const [feQuery, setFeQuery] = useState<FrontendAssetFilterQuery>({
    status: AssetStatus.Ready,
    wallet: address,
  });

  // query to use on backend api call, to pull data we have
  const [beQuery, setBeQuery] = useState<BackendAssetQueryParams>({
    skip: 0,
    take: 50,
  });

  // query assets in escrow
  const [loansQuery, setLoansQuery] = useState<BackendLoanQueryParams>({
    skip: 0,
    take: 50,
    walletAddress: address,
    status: LoanStatus.Active,
  });

  const myAssets = useSelector((state: RootState) => selectAssetsByQuery(state, feQuery));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: assets, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(osQuery, {
    skip: !osQuery.owner,
  });
  const { data: loans } = useGetLoansQuery(loansQuery, {});

  // using the opensea assets, crosscheck with backend api for correlated data
  useGetListingsQuery(beQuery, {
    skip: !beQuery.openseaIds || beQuery.openseaIds?.length < 1 || !authSignature,
  });

  useEffect(() => {
    const newQuery = {
      ...beQuery,
      openseaIds: assets?.map((asset: OpenseaAsset) => asset.id.toString()),
    };
    setBeQuery(newQuery);
  }, [assets]);

  useEffect(() => {
    setOsQuery({
      ...osQuery,
      owner: address,
    });
    setFeQuery({
      ...feQuery,
      wallet: address,
    });
    setLoansQuery({
      ...loansQuery,
      walletAddress: address,
    });
  }, [address]);

  const assetsToShow: Asset[] =
    feQuery.status === AssetStatus.Locked && loans
      ? loans?.map((loan) => loan.assetListing.asset)
      : myAssets;

  return (
    <Box className="flex fr fj-c">
      {assetsLoading && <CircularProgress />}
      <AssetList assets={assetsToShow} type="borrow" />
    </Box>
  );
}

export default MyAccountAssets;
