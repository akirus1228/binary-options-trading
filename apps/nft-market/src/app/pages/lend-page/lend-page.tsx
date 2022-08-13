import { scrollTo } from "@fantohm/shared-helpers";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyGetListingsQuery } from "../../api/backend-api";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import AssetTypeFilter from "../../components/asset-type-filter/asset-type-filter";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { ListingQueryParam, ListingSort } from "../../store/reducers/interfaces";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  const [displayAssets, setDisplayAssets] = useState<Asset[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(3);
  const [query, setQuery] = useState<ListingQueryParam>({
    skip: 0,
    take,
    status: ListingStatus.Listed,
    sort: ListingSort.Recently,
  });
  const { user } = useSelector((state: RootState) => state.backend);
  const [trigger, listingsResult] = useLazyGetListingsQuery();

  useEffect(() => {
    // if we're down the page we should go ahead and scroll back to the top of the results
    if (window.scrollY > 300) {
      scrollTo(300);
    }
    setSkip(0);
    trigger({ ...query, skip: 0, take });
    setDisplayAssets([]);
  }, [query]);

  useEffect(() => {
    if (!listingsResult.isSuccess) return;
    if (!listingsResult.data.length) return;
    const listings = listingsResult.data;
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
    setDisplayAssets([...displayAssets, ...newAssets]);
  }, [listingsResult.data]);

  const fetchMoreData = () => {
    setSkip(skip + 3);
    trigger({ ...query, skip, take });
  };

  return (
    <Container className={style["lendPageContainer"]}>
      <HeaderBlurryImage
        url={
          displayAssets && displayAssets.length > 0
            ? displayAssets[0].imageUrl
            : undefined
        }
        height="300px"
      />
      <h1>Explore loan requests</h1>
      <Box sx={{ mt: "3em" }}>
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={3}>
            <LenderAssetFilter query={query} setQuery={setQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {listingsResult.isLoading && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            <AssetTypeFilter query={query} setQuery={setQuery} />
            <AssetList
              assets={displayAssets}
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
