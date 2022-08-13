import {
  Box,
  Select,
  CircularProgress,
  MenuItem,
  Container,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
import style from "../../../components/asset-filter/borrower-asset-filter/borrower-asset-filter.module.scss";

export interface MyAccountAssetsProps {
  address: string;
}

export function MyAccountAssets({ address }: MyAccountAssetsProps) {
  const [status, setStatus] = useState<string>("All");

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
  const { data: osResponse, isLoading: assetsLoading } = useGetOpenseaAssetsQuery(
    osQuery,
    {
      skip: !osQuery.owner,
    }
  );
  const { data: loans } = useGetLoansQuery(loansQuery, {});

  // using the opensea assets, crosscheck with backend api for correlated data
  useGetListingsQuery(beQuery, {
    skip: !beQuery.openseaIds || beQuery.openseaIds?.length < 1 || !authSignature,
  });

  const getStatusType = (status: string): AssetStatus | "All" => {
    switch (status) {
      case "All":
        return "All";
      case "Listed":
        return AssetStatus.Listed;
      case "Unlisted":
        return AssetStatus.Ready;
      case "In Escrow":
        return AssetStatus.Locked;
      default:
        return AssetStatus.New;
    }
  };

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      if (!["All", "Unlisted", "Listed", "In Escrow"].includes(event.target.value))
        return;
      setStatus(event.target.value);
      const updatedQuery: FrontendAssetFilterQuery = {
        ...feQuery,
        status: getStatusType(event.target.value),
      };
      setFeQuery(updatedQuery);
    },
    [feQuery]
  );

  useEffect(() => {
    const newQuery = {
      ...beQuery,
      openseaIds: osResponse?.assets?.map((asset: OpenseaAsset) => asset.id.toString()),
    };
    setBeQuery(newQuery);
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

  const assetsToShow: Asset[] =
    feQuery.status === AssetStatus.Locked && loans
      ? loans?.map((loan) => loan.assetListing.asset)
      : myAssets;

  return (
    <Box className="flex fr fj-c" sx={{ mt: "50px" }}>
      {assetsLoading ? (
        <CircularProgress />
      ) : (
        <Container sx={{ mt: "30px" }} maxWidth="lg">
          <Box className="flex fr fj-fe">
            <Select
              labelId="asset-sort-by"
              label="Sort by"
              defaultValue="Unlisted"
              id="asset-sort-select"
              sx={{
                width: "200px",
                borderRadius: "10px",
                border: "3px solid rgba(0,0,0,0.1)",
                padding: "0 10px 0 20px",
              }}
              onChange={handleStatusChange}
              value={status}
              className={style["sortList"]}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Listed">Listed</MenuItem>
              <MenuItem value="Unlisted">Unlisted</MenuItem>
              <MenuItem value="In Escrow">In Escrow</MenuItem>
            </Select>
          </Box>
          <AssetList assets={assetsToShow} type="borrow" />
        </Container>
      )}
    </Box>
  );
}

export default MyAccountAssets;
