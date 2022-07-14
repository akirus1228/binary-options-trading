//import style from "./lender-asset-filter.module.scss";
import {
  Box,
  Icon,
  ListSubheader,
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
import { ListingQueryParam, ListingSort } from "../../../store/reducers/interfaces";
import { Collection } from "../../../types/backend-types";
import CollectionsFilter from "../../collections-filter/collections-filter";
import { useGetCollectionsQuery } from "../../../api/backend-api";
import style from "./lender-asset-filter.module.scss";

export interface LenderAssetFilterProps {
  query: ListingQueryParam;
  setQuery: Dispatch<SetStateAction<ListingQueryParam>>;
}

const initialPriceRange = [0, 100];
const initialAprRange = [0, 400];
const initialDurationRange = [0, 365];

export const LenderAssetFilter = ({
  query,
  setQuery,
}: LenderAssetFilterProps): JSX.Element => {
  const { data: collections } = useGetCollectionsQuery({});
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);
  const [aprRange, setAprRange] = useState<number[]>(initialAprRange);
  const [durationRange, setDurationRange] = useState<number[]>(initialDurationRange);
  const [collection, setCollection] = useState<Collection>({} as Collection);
  const [sort, setSort] = useState<string>(ListingSort.Recently);

  const valuetext = (value: number) => {
    return `$${value}`;
  };

  const aprValuetext = (value: number) => {
    return `${value}%`;
  };

  const durationValuetext = (value: number) => {
    return `${value} days`;
  };

  const getSortType = (status: string): ListingSort => {
    switch (status) {
      case "Recent":
        return ListingSort.Recently;
      case "Oldest":
        return ListingSort.Oldest;
      case "Highest Price":
        return ListingSort.Highest;
      case "Lowest Price":
        return ListingSort.Lowest;
      default:
        return ListingSort.Recently;
    }
  };

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    if (!event) return;
    setSort(event.target.value);

    //trigger query update
    setQuery({ ...query, sort: getSortType(event.target.value) });
  }, []);

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange(newValue);
  };

  const handlePriceRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange(newValue);

    //trigger query update
    setQuery({
      ...query,
      minPrice: scaleValues(newValue)[0],
      maxPrice: scaleValues(newValue)[1],
    });
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
  const followersMarks = [
    {
      value: 0,
      scaledValue: 0,
      label: "0",
    },
    {
      value: 25,
      scaledValue: 10000,
      label: "10k",
    },
    {
      value: 50,
      scaledValue: 50000,
      label: "50k",
    },
    {
      value: 75,
      scaledValue: 250000,
      label: "250k",
    },
    {
      value: 100,
      scaledValue: 1000000,
      label: "1M",
    },
  ];
  const scaleValues = (valueArray: any) => {
    return [scale(valueArray[0]), scale(valueArray[1])];
  };
  const scale = (value: any) => {
    const previousMarkIndex = Math.floor(value / 25);
    const previousMark = followersMarks[previousMarkIndex];
    const remainder = value % 25;
    if (remainder === 0) {
      return previousMark.scaledValue;
    }
    const nextMark = followersMarks[previousMarkIndex + 1];
    const increment = (nextMark.scaledValue - previousMark.scaledValue) / 25;
    return remainder * increment + previousMark.scaledValue;
  };

  function numFormatter(num: any) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  return (
    <Box sx={{ ml: "auto" }}>
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Recent"
        id="asset-sort-select"
        sx={{
          width: "100%",
          borderRadius: "10px",
          border: "3px solid rgba(0,0,0,0.1)",
          padding: "0 10px 0 20px",
        }}
        value={sort}
        onChange={handleSortChange}
        className={style["sortList"]}
      >
        <MenuItem value="Recent">Sort By: Recently Listed</MenuItem>
        <MenuItem value="Oldest">Sort By: Oldest Listed</MenuItem>
        <MenuItem value="Highest Price">Sort By: Price Higest</MenuItem>
        <MenuItem value="Lowest Price">Sort By: Price Lowest</MenuItem>
      </Select>
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          mt: {
            xs: "20px",
            md: "40px",
          },
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          Price range
        </ListSubheader>
        <Slider
          getAriaLabel={() => "Price range"}
          min={0}
          step={1}
          max={100}
          valueLabelFormat={numFormatter}
          marks={followersMarks}
          scale={scale}
          value={priceRange}
          onChange={handlePriceRangeChange}
          onChangeCommitted={handlePriceRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{
            margin: {
              xs: "0",
              sm: "10px 0",
            },
          }}
        />
        <Box className="flex fj-sb" sx={{ paddingTop: "10px" }}>
          <Typography>Values: {JSON.stringify(scaleValues(priceRange))} USD</Typography>
        </Box>
      </Box>
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: "40px",
          pt: "40px",
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          Apr range
        </ListSubheader>
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
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: "40px",
          pt: "40px",
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          Duration
        </ListSubheader>
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
      <CollectionsFilter
        collections={collections}
        collection={collection}
        setCollection={setCollection}
      />

      <Box
        className="flex fr ai-c"
        sx={{
          cursor: "pointer",
          margin: "20px 0 0 0",
          padding: "20px 0 0 0",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
        onClick={handleResetFilters}
      >
        <Icon sx={{ opacity: "0.4" }}>
          <CancelOutlinedIcon />
        </Icon>
        <Typography sx={{ opacity: "0.4", margin: "5px 0 0 15px" }}>
          Reset filter
        </Typography>
      </Box>
    </Box>
  );
};

export default LenderAssetFilter;
