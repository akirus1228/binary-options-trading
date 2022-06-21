import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetListingsQuery, useGetLoansQuery } from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { OpenseaAssetQueryParam } from "../../store/reducers/interfaces";
import { selectAssetsByQuery } from "../../store/selectors/asset-selectors";
import {
  AssetStatus,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  FrontendAssetFilterQuery,
  LoanStatus,
} from "../../types/backend-types";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const { address } = useWeb3Context();
  const { user } = useSelector((state: RootState) => state.backend);
  // query to pass to opensea to pull data
  const [osQuery, setOsQuery] = useState<OpenseaAssetQueryParam>({
    limit: 50,
    owner: user.address,
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
    lenderAddress: address,
    status: LoanStatus.Active,
  });

  const myAssets = useSelector((state: RootState) => selectAssetsByQuery(state, feQuery));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: assets, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(osQuery, {
    skip: !user.address,
  });
  const { data: loans, isLoading: isLoansLoaing } = useGetLoansQuery(loansQuery, {});

  // using the opensea assets, crosscheck with backend api for correlated data
  const { isLoading: isAssetLoading } = useGetListingsQuery(beQuery, {
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
      lenderAddress: address,
    });
  }, [address]);

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <HeaderBlurryImage
        url={myAssets.length > 0 ? myAssets[0].imageUrl : undefined}
        height="300px"
      />
      <Box className="flex fr fj-sb ai-c">
        <h1>Choose an asset to collateralize</h1>
        <span>{myAssets.length} assets available</span>
      </Box>
      <Box sx={{ mt: "3em" }}>
        <Grid container maxWidth="xl" columnSpacing={5}>
          <Grid item xs={0} md={3}>
            <BorrowerAssetFilter query={feQuery} setQuery={setFeQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {(assetsLoading || isAssetLoading || isLoansLoaing) && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            {(!address || !authSignature) && (
              <Box className="flex fr fj-c">
                <h1>Please connect your wallet.</h1>
              </Box>
            )}
            <AssetList
              assets={
                feQuery.status === AssetStatus.Locked && loans
                  ? loans?.map((loan) => loan.assetListing.asset)
                  : myAssets
              }
              type="borrow"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
