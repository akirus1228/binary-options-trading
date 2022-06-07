//import style from "./lender-asset-filter.module.scss";
import {
  Box,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ListingQueryParam } from "../../../store/reducers/interfaces";
import { Collection } from "../../../types/backend-types";
import CollectionsFilter from "../../collections-filter/collections-filter";

export interface LenderAssetFilterProps {
  query: ListingQueryParam;
  setQuery: Dispatch<SetStateAction<ListingQueryParam>>;
}

const initialPriceRange = [0, 10000000];
const initialAprRange = [0, 400];
const initialDurationRange = [0, 365];

export const LenderAssetFilter = ({
  query,
  setQuery,
}: LenderAssetFilterProps): JSX.Element => {
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);
  const [aprRange, setAprRange] = useState<number[]>(initialAprRange);
  const [durationRange, setDurationRange] = useState<number[]>(initialDurationRange);
  const [collection, setCollection] = useState<Collection>({} as Collection);

  const valuetext = (value: number) => {
    return `$${value}`;
  };

  const aprValuetext = (value: number) => {
    return `${value}%`;
  };

  const durationValuetext = (value: number) => {
    return `${value} days`;
  };

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    let sort;
    console.log(event);
  }, []);

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange([newValue[0], newValue[1]]);
  };

  const handlePriceRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange([newValue[0], newValue[1]]);

    //trigger query update
    setQuery({ ...query, minPrice: newValue[0], maxPrice: newValue[1] });
  };

  const handleAprRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setAprRange([newValue[0], newValue[1]]);
  };

  const handleAprRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setAprRange([newValue[0], newValue[1]]);

    //trigger query update
    const newQuery = { ...query, minApr: newValue[0], maxApr: newValue[1] };
    setQuery(newQuery);
  };

  const handleDurationRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setDurationRange([newValue[0], newValue[1]]);
  };

  const handleDurationRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setDurationRange([newValue[0], newValue[1]]);

    //trigger query update
    setQuery({ ...query, minDuration: newValue[0], maxDuration: newValue[1] });
  };

  useMemo(() => {
    const updatedQuery: ListingQueryParam = {
      ...query,
      contractAddress: collection.contractAddress,
    };
    if (updatedQuery.contractAddress === query.contractAddress) return;
    setQuery(updatedQuery);
  }, [collection, query, setQuery]);

  const handleResetFilters = () => {
    handlePriceRangeChangeCommitted({ target: {} } as Event, initialPriceRange);
    handleAprRangeChangeCommitted({ target: {} } as Event, initialAprRange);
    handleDurationRangeChangeCommitted({ target: {} } as Event, initialDurationRange);
    handleSortChange({ target: { value: "Recent" } } as SelectChangeEvent<string>);
    setCollection({} as Collection);
  };

  return (
    <Box sx={{ maxWidth: "250px", ml: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Recent"
        id="asset-sort-select"
        sx={{ width: "100%" }}
        onChange={handleSortChange}
      >
        <MenuItem value="Recent">Sort By: Recently Listed</MenuItem>
        <MenuItem value="Oldest">Sort By: Oldest Listed</MenuItem>
        <MenuItem value="Highest Price">Sort By: Price Higest</MenuItem>
        <MenuItem value="Lowest Price">Sort By: Price Lowest</MenuItem>
      </Select>
      <Box className="flex fc">
        <span>Price range</span>
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={handlePriceRangeChange}
          onChangeCommitted={handlePriceRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          min={0}
          max={10000}
        />
        <Box className="flex fj-sb">
          <span style={{ fontSize: "10px" }}>{priceRange[0]} USDB</span>
          <span style={{ fontSize: "10px" }}>{priceRange[1]} USDB</span>
        </Box>
      </Box>
      <Box className="flex fc">
        <span>Apr range</span>
        <Slider
          getAriaLabel={() => "Apr range"}
          value={aprRange}
          onChange={handleAprRangeChange}
          onChangeCommitted={handleAprRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={aprValuetext}
          min={0}
          max={400}
        />
      </Box>
      <Box className="flex fj-sb">
        <span style={{ fontSize: "10px" }}>{aprRange[0]}%</span>
        <span style={{ fontSize: "10px" }}>{aprRange[1]}%</span>
      </Box>
      <Box className="flex fc">
        <span>Duration</span>
        <Slider
          getAriaLabel={() => "Duratioun range"}
          value={durationRange}
          onChange={handleDurationRangeChange}
          onChangeCommitted={handleDurationRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={durationValuetext}
          min={0}
          max={365}
        />
      </Box>
      <Box className="flex fj-sb">
        <span style={{ fontSize: "10px" }}>{durationRange[0]} days</span>
        <span style={{ fontSize: "10px" }}>{durationRange[1]} days</span>
      </Box>
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

export default LenderAssetFilter;
