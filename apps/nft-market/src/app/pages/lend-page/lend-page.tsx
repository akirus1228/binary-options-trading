import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetListingsQuery } from "../../api/backend-api";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import AssetTypeFilter from "../../components/asset-type-filter/asset-type-filter";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { ListingQueryParam, ListingSort } from "../../store/reducers/interfaces";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(12);
  const [query, setQuery] = useState<ListingQueryParam>({
    skip,
    take,
    status: ListingStatus.Listed,
    sort: ListingSort.Recently,
  });
  const { user } = useSelector((state: RootState) => state.backend);
  const { data: listings, isLoading, isSuccess } = useGetListingsQuery(query);

  useEffect(() => {
    setAssets([]);
  }, [
    query.status,
    query.sort,
    query.minApr,
    query.maxApr,
    query.minPrice,
    query.maxPrice,
    query.minDuration,
    query.maxDuration,
  ]);

  useEffect(() => {
    if (!listings) {
      return;
    }
    // if we got less listings than we tried to take, then we're at the end of the list
    if (listings.length < take) {
      setHasNext(false);
    }
    const newAssets: Asset[] = listings
      .filter(
        (listing: Listing) =>
          new Date(listing.term.expirationAt).getTime() >= new Date().getTime()
      )
      .sort((a, b) => {
        if (a.asset.owner.address === user.address) {
          return 1;
        } else if (b.asset.owner.address === user.address) {
          return -1;
        }

        if (query.sort === ListingSort.Recently) {
          return (
            new Date(b.createdAt || "0").getTime() -
            new Date(a.createdAt || "0").getTime()
          );
        } else if (query.sort === ListingSort.Oldest) {
          return (
            new Date(a.createdAt || "0").getTime() -
            new Date(b.createdAt || "0").getTime()
          );
        } else if (query.sort === ListingSort.Highest) {
          return b.term.amount - a.term.amount;
        } else if (query.sort === ListingSort.Lowest) {
          return a.term.amount - b.term.amount;
        }
        return 0;
      })
      .map((listing: Listing): Asset => {
        return listing.asset;
      });
    setAssets([...assets, ...newAssets]);
  }, [listings, query.sort]);

  const fetchMoreData = () => {
    setQuery({ ...query, skip: skip + 3 });
    setSkip(skip + 3);
  };

  return (
    <Container className={style["lendPageContainer"]}>
      <HeaderBlurryImage
        url={listings && listings.length > 0 ? listings[0].asset.imageUrl : undefined}
        height="300px"
      />
      <h1>Explore loan requests</h1>
      <Box sx={{ mt: "3em" }}>
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={3}>
            <LenderAssetFilter query={query} setQuery={setQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {isLoading && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            <AssetTypeFilter query={query} setQuery={setQuery} />
            <AssetList
              assets={assets}
              type="lend"
              fetchData={fetchMoreData}
              hasMore={hasNext}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LendPage;
