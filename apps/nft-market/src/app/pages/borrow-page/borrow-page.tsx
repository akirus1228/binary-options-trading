import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetListingsQuery,
  useGetLoansQuery,
  useGetNftAssetsQuery,
} from "../../api/backend-api";
import { OpenseaAsset, useGetOpenseaAssetsQuery } from "../../api/opensea";
import BorrowerAssetFilter from "../../components/asset-filter/borrower-asset-filter/borrower-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { selectAssetsByQuery } from "../../store/selectors/asset-selectors";
import {
  Asset,
  AssetStatus,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  BackendNftAssetsQueryParams,
  FrontendAssetFilterQuery,
  LoanStatus,
} from "../../types/backend-types";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  const take = 20;
  const { address } = useWeb3Context();
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  const isOpenseaUp = useSelector((state: RootState) => state.app.isOpenseaUp);
  // query to pass to opensea to pull data
  const [osQuery, setOsQuery] = useState<BackendNftAssetsQueryParams>({
    limit: take,
    erc20Address: user.address,
    contractAddress: "0x0c790b0b5f362868d7641c5cb953ae03ef53b451",
  });

  const [continuation, setContinuation] = useState("");
  const [hasNext, setHasNext] = useState(true);

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

  // load assets from opensea api
  const { data: npResponse, isLoading: assetsLoading } = useGetNftAssetsQuery(osQuery, {
    skip: !osQuery.erc20Address || !isOpenseaUp,
  });

  // load assets from opensea api
  const { data: osResponse } = useGetOpenseaAssetsQuery(
    {
      asset_contract_addresses: npResponse?.assets.map(
        (item) => item.assetContractAddress
      ),
      token_ids: npResponse?.assets.map((item) => item.tokenId),
    },
    {
      skip: !npResponse?.assets || assetsLoading,
    }
  );

  const { data: loans, isLoading: isLoansLoaing } = useGetLoansQuery(loansQuery, {
    skip: !address || (feQuery.status !== AssetStatus.Locked && feQuery.status !== "All"),
  });

  // using the opensea assets, crosscheck with backend api for correlated data
  const { isLoading: isAssetLoading, isSuccess: isAssetLoadSuccess } =
    useGetListingsQuery(beQuery, {
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
    if (npResponse && npResponse.continuation) {
      setContinuation(npResponse?.continuation || "");
    } else if (npResponse && npResponse.continuation === null) {
      setHasNext(false);
    }
  }, [osResponse]);

  useEffect(() => {
    setOsQuery({
      ...osQuery,
      erc20Address: address,
    });
    setFeQuery({
      ...feQuery,
      wallet: address,
    });
    setLoansQuery({
      ...loansQuery,
      borrowerAddress: address,
    });
  }, [address]);

  const assetsInEscrow =
    loans
      ?.map((loan) => loan.assetListing.asset)
      .filter((asset) => asset.status === AssetStatus.Locked) || [];

  const assetsToShow: Asset[] = useMemo(() => {
    return (
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
      assetA.status === AssetStatus.Locked && assetB.status !== AssetStatus.Locked
        ? -1
        : 1
    );
  }, [assetsInEscrow, feQuery.status, myAssets]);

  const isWalletConnected = address && authSignature;

  const fetchMoreData = () => {
    console.log("fetchMoreData", { ...osQuery, continuation: continuation });
    setOsQuery({ ...osQuery, continuation: continuation });
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
                {assetsLoading || isAssetLoading || isLoansLoaing || isAssetLoading ? (
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
                {isAssetLoadSuccess && (
                  <AssetList
                    assets={assetsToShow}
                    type="borrow"
                    fetchData={fetchMoreData}
                    hasMore={hasNext}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BorrowPage;
