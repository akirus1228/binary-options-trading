import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
// import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import { Asset } from "../../types/backend-types";
import LenderAsset from "./lender-asset/lender-asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback } from "react";

// if allAssetsForPagination is passed, we should use pagination with allAssetsForPagination
export interface AssetListProps {
  allAssetsForPagination?: Asset[];
  assets: Asset[];
  type: "lend" | "borrow";
  address?: string;
  sx?: SxProps<Theme>;
  fetchData?: () => any;
  hasMore?: boolean;
}

export const AssetList = (props: AssetListProps): JSX.Element => {
  const AssetThumb = props.type === "lend" ? LenderAsset : BorrowerAsset;
  const defaultFn = useCallback(() => {
    console.log("checking for more data");
  }, []);

  return (
    <Box className="flex w100">
      <InfiniteScroll
        dataLength={
          props.allAssetsForPagination
            ? props.allAssetsForPagination.length
            : props.assets.length
        } //This is important field to render the next data
        next={props.fetchData || defaultFn}
        hasMore={props.hasMore || false}
        loader={
          <Box className="flex fw fr fj-c ai-c w100">
            Loading
            <CircularProgress size={16} sx={{ ml: 1 }} />
          </Box>
        }
        className="flex fr fw w100"
        endMessage={<Box className="flex fw fr fj-c ai-c w100"></Box>}
        scrollableTarget={document.body}
      >
        {props.allAssetsForPagination
          ? props.allAssetsForPagination.map((asset: Asset, index: number) => {
              if (
                props.assets.findIndex(
                  (item) =>
                    item.assetContractAddress === asset.assetContractAddress &&
                    item.tokenId === asset.tokenId
                ) === -1
              ) {
                return <span key={`asset-${index}`}></span>; // for empty item
              }
              return <AssetThumb key={`asset-${index}`} asset={asset} />;
            })
          : props.assets &&
            props.assets.map((asset: Asset, index: number) => (
              <AssetThumb key={`asset-${index}`} asset={asset} />
            ))}
      </InfiniteScroll>
    </Box>
  );
};

export default AssetList;
