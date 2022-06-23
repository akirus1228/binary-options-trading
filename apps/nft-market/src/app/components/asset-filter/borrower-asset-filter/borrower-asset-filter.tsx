import {
  Box,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  AssetStatus,
  Collection,
  FrontendAssetFilterQuery,
} from "../../../types/backend-types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import CollectionsFilter from "../../collections-filter/collections-filter";
// import style from "./borrower-asset-filter.module.scss";

export interface BorrowerAssetFilterProps {
  query: FrontendAssetFilterQuery;
  setQuery: Dispatch<SetStateAction<FrontendAssetFilterQuery>>;
}

export const BorrowerAssetFilter = ({
  query,
  setQuery,
}: BorrowerAssetFilterProps): JSX.Element => {
  const [status, setStatus] = useState<string>("Unlisted");
  const [collection, setCollection] = useState<Collection>({} as Collection);

  const getStatusType = (status: string): AssetStatus => {
    switch (status) {
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
      if (!["Unlisted", "Listed", "In Escrow"].includes(event.target.value)) return;
      setStatus(event.target.value);
      const updatedQuery: FrontendAssetFilterQuery = {
        ...query,
        status: getStatusType(event.target.value),
      };
      setQuery(updatedQuery);
    },
    [query]
  );

  useEffect(() => {
    if (collection.contractAddress === query.assetContractAddress) return;
    const updatedQuery: FrontendAssetFilterQuery = {
      ...query,
      assetContractAddress: collection.contractAddress,
    };
    setQuery(updatedQuery);
  }, [collection]);

  const handleResetFilters = () => {
    handleStatusChange({ target: { value: "Unlisted" } } as SelectChangeEvent<string>);
    setCollection({} as Collection);
  };

  return (
    <Box sx={{ maxWidth: "250px", ml: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Unlisted"
        id="asset-sort-select"
        sx={{ width: "100%" }}
        onChange={handleStatusChange}
        value={status}
      >
        <MenuItem value="Listed">Listed</MenuItem>
        <MenuItem value="Unlisted">Unlisted</MenuItem>
        <MenuItem value="In Escrow">In Escrow</MenuItem>
      </Select>
      <hr />
      <CollectionsFilter collection={collection} setCollection={setCollection} />
      <hr />
      <Box
        className="flex fr ai-c"
        sx={{ cursor: "pointer" }}
        onClick={handleResetFilters}
      >
        <Icon>
          <CancelOutlinedIcon />
        </Icon>
        <Typography>Reset filter</Typography>
      </Box>
    </Box>
  );
};

export default BorrowerAssetFilter;
