import { Box, SxProps, Theme } from "@mui/material";
// import style from "./asset-list.module.scss";
import BorrowerAsset from "./borrower-asset/borrower-asset";
import { Asset } from "../../types/backend-types";
import LenderAsset from "./lender-asset/lender-asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback } from "react";

export interface AssetListProps {
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
    <Box className="flex">
      <InfiniteScroll
        dataLength={props.assets.length} //This is important field to render the next data
        next={props.fetchData || defaultFn}
        hasMore={props.hasMore || false}
        loader={<h4>Loading...</h4>}
        className="flex fr fw"
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>End</b>
          </p>
        }
      >
        {props.assets &&
          props.assets.map((asset: Asset, index: number) => (
            <AssetThumb key={`asset-${index}`} asset={asset} />
          ))}
      </InfiniteScroll>
    </Box>
  );
};

export default AssetList;
