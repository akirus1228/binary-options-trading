import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
  Asset,
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
    limit: 3,
    owner: user.address,
  });

  const [osNext, setOsNext] = useState("");

  // query to use on frontend to filter cached results and ultimately display
  const [feQuery, setFeQuery] = useState<FrontendAssetFilterQuery>({
    status: "All",
    wallet: address,
  });

  // query to use on backend api call, to pull data we have
  const [beQuery, setBeQuery] = useState<BackendAssetQueryParams>({
    skip: 0,
    take: 20,
  });

  // query assets in escrow
  const [loansQuery, setLoansQuery] = useState<BackendLoanQueryParams>({
    skip: 0,
    take: 50,
    walletAddress: address,
    status: LoanStatus.Active,
  });

  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: osResponse, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(
    osQuery,
    {
      skip: !osQuery.owner,
    }
  );
  const { data: loans, isLoading: isLoansLoaing } = useGetLoansQuery(loansQuery, {
    skip: !address,
  });

  // using the opensea assets, crosscheck with backend api for correlated data
  const { isLoading: isAssetLoading } = useGetListingsQuery(beQuery, {
    skip: !beQuery.openseaIds || beQuery.openseaIds?.length < 1 || !authSignature,
  });

  const myAssets = useSelector((state: RootState) => selectAssetsByQuery(state, feQuery));

  useEffect(() => {
    const newQuery = {
      ...beQuery,
      openseaIds: osResponse?.assets?.map((asset: OpenseaAsset) => asset.id.toString()),
    };
    setBeQuery(newQuery);
    // store the next page cursor ID
    setOsNext(osResponse?.next || "");
  }, [osResponse]);

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

  const assetsInEscrow =
    loans
      ?.map((loan) => loan.assetListing.asset)
      .filter((asset) => asset.status === AssetStatus.Locked) || [];

  const assetsToShow: Asset[] = (
    feQuery.status === AssetStatus.Locked && loans
      ? assetsInEscrow
      : feQuery.status === "All"
      ? [
          ...myAssets,
          ...assetsInEscrow.filter((asset) => asset.owner.address !== address),
        ]
      : myAssets
  ).sort((assetA: Asset, assetB: Asset) =>
    // always sort escrow to top to avoid infinite scroll injecting in the middle
    assetA.status === AssetStatus.Locked && assetB.status !== AssetStatus.Locked ? -1 : 1
  );

  const isWalletConnected = address && authSignature;

  const fetchMoreData = () => {
    console.log("fetching more os data");
    setOsQuery({ ...osQuery, cursor: osNext });
  };

  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <HeaderBlurryImage
        url={myAssets.length > 0 ? myAssets[0].imageUrl : undefined}
        height="300px"
      />
      <Box className="flex fr fj-sb ai-c">
        <h1>Choose an asset to borrow against</h1>
      </Box>
      <Box sx={{ mt: "3em" }}>
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={3}>
            <BorrowerAssetFilter query={feQuery} setQuery={setFeQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {!isWalletConnected && (
              <Box className="flex fr fj-c">
                <h1>Please connect your wallet.</h1>
              </Box>
            )}
            {isWalletConnected && (
              <>
                {assetsLoading || isAssetLoading || isLoansLoaing ? (
                  <Box className="flex fr fj-c">
                    <CircularProgress />
                  </Box>
                ) : (
                  assetsToShow.length === 0 && (
                    <Box
                      className="flex fr fj-c"
                      sx={{
                        mt: "5rem",
                        fontWeight: "400",
                        fontSize: "1.5rem",
                      }}
                    >
                      No assets have been found in your wallet
                    </Box>
                  )
                )}
                <AssetList
                  assets={assetsToShow}
                  type="borrow"
                  fetchData={fetchMoreData}
                  hasMore={true}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
