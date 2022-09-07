import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Icon,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { RefObject, useEffect, useRef, useState } from "react";
import { AssetStatus, Collection, LoanStatus } from "../../../types/backend-types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetLoansQuery, useLazyGetCollectionsQuery } from "../../../api/backend-api";
import { Link } from "react-router-dom";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  useLazyGetRawOpenseaAssetsQuery,
  useLazyGetOpenseaCollectionsQuery,
  Nullable,
} from "../../../api/opensea";

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "25px",
  width: "100%",
  borderRadius: "30px",
  border: "3px solid rgba(0,0,0,0.1)",
  "& .MuiOutlinedInput-root": {
    borderRadius: "30px",
  },
  "& .close:hover": {
    cursor: "pointer",
  },
}));

export interface AssetSearchProps {
  setCollection: (collection: Collection) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export const BorrowerAssetSearch = ({
  setCollection,
  keyword,
  setKeyword,
}: AssetSearchProps): JSX.Element => {
  const { address } = useWeb3Context();
  const ref = useRef<HTMLElement>(null);
  const [triggerOpenseaSearch, searchedOwnedCollections] =
    useLazyGetOpenseaCollectionsQuery();
  const { data: loans } = useGetLoansQuery(
    {
      skip: 0,
      take: 50,
      walletAddress: address,
      status: LoanStatus.Active,
    },
    {
      skip: !address,
    }
  );
  const assetsInEscrow =
    loans
      ?.map((loan) => loan.assetListing.asset)
      .filter((asset) => asset.status === AssetStatus.Locked) || [];

  const [isFocus, setIsFocus] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [assets, setAssets] = useState<
    {
      assetContractAddress?: Nullable<string>;
      tokenId: string;
      name: Nullable<string>;
      imageUrl?: Nullable<string>;
      frameUrl?: Nullable<string>;
      thumbUrl?: Nullable<string>;
    }[]
  >([]);
  const [collections, setCollections] = useState<
    (Collection & {
      ownedCount: number;
    })[]
  >([]);
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const [triggerCollections, searchedCollections] = useLazyGetCollectionsQuery();
  const [triggerAssets, searchedAssets] = useLazyGetRawOpenseaAssetsQuery();

  useEffect(() => {
    if (!address) return;

    triggerOpenseaSearch({ asset_owner: address });
  }, [address]);

  const onChangeKeyword = (value: string) => {
    setKeyword(value);
  };

  useEffect(() => {
    if (keyword !== "") {
      triggerCollections({
        keyword,
      });
    } else {
      setAssets([]);
      setCollections([]);
    }
  }, [keyword]);

  useEffect(() => {
    if (!searchedCollections.isSuccess) return;
    if (!searchedOwnedCollections.isSuccess) return;

    const filteredCollections = searchedCollections.data
      .map((item) => {
        const ownedCount =
          searchedOwnedCollections.data.find((sub) => sub.slug === item.slug)
            ?.owned_asset_count || 0;
        return {
          ...item,
          ownedCount:
            ownedCount +
            assetsInEscrow.filter(
              (asset) => asset.assetContractAddress === item.contractAddress
            ).length,
        };
      })
      .filter((item) => item.ownedCount > 0)
      .sort((a, b) => {
        return b.ownedCount - a.ownedCount;
      })
      .filter((_, index) => index <= 2);

    setCollections(filteredCollections);

    triggerAssets({
      owner: address,
      asset_contract_addresses: filteredCollections.map((item) => item.contractAddress),
    });
  }, [searchedCollections.data, searchedCollections.fulfilledTimeStamp]);

  useEffect(() => {
    if (!searchedAssets.isSuccess) return;

    const assets =
      collections.length > 0
        ? searchedAssets.data.assets
            .filter((_, index) => index <= 2)
            .map((item) => {
              return {
                assetContractAddress: item.asset_contract?.address,
                tokenId: item.token_id,
                name: item.name,
                imageUrl: item.image_url,
                frameUrl: item.animation_url,
                thumbUrl: item.image_thumbnail_url,
              };
            })
        : [];

    if (assets.length < 3) {
      for (let i = 0; i < assetsInEscrow.length && assets.length < 3; i++) {
        const asset = assetsInEscrow[i];
        if (
          collections.find(
            (collection) => collection.contractAddress === asset.assetContractAddress
          )
        ) {
          assets.push(asset);
        }
      }
    }

    setAssets(assets);
  }, [searchedAssets.data, searchedAssets.fulfilledTimeStamp]);

  const handleClickOutside = () => {
    setIsDropdown(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <Box sx={{ position: "relative" }} ref={ref}>
      <StyledTextField
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        onFocus={() => {
          setIsFocus(true);
          setIsDropdown(true);
        }}
        onBlur={() => setIsFocus(false)}
        placeholder="Search for an item or collection"
        InputProps={{
          startAdornment: (
            <Icon component={SearchIcon} color={isFocus ? "primary" : "disabled"} />
          ),
          endAdornment:
            keyword.length > 0 ? (
              <Icon
                component={CloseIcon}
                onClick={() => onChangeKeyword("")}
                className="close"
                style={{
                  border: "1px solid #e0dcd9",
                  borderRadius: "50%",
                  padding: "4px",
                  width: "30px",
                  height: "30px",
                }}
              />
            ) : null,
        }}
      />
      {isDropdown &&
        (searchedCollections.isFetching ||
          (collections && collections?.length > 0) ||
          searchedAssets.isFetching ||
          (assets && assets?.length > 0)) && (
          <Box
            sx={{
              position: "absolute",
              top: "70px",
              padding: "40px 28px 20px 28px",
              zIndex: "10",
              width: "100%",
              borderRadius: "20px",
              background: `${themeType === "light" ? "white" : "black"}`,
              boxShadow: "0px 0px 12px 0px #7e9aa926",
            }}
          >
            {(searchedCollections.isFetching ||
              (collections && collections?.length > 0)) && (
              <Typography>Collections</Typography>
            )}
            {searchedCollections.isFetching && (
              <Box className="flex fr fj-c">
                <CircularProgress
                  sx={{
                    margin: "20px",
                    width: "30px !important",
                    height: "30px !important",
                  }}
                />
              </Box>
            )}
            {!searchedCollections.isFetching &&
              collections &&
              collections.length > 0 &&
              collections?.slice(0, 3).map((collection) => {
                return (
                  <Box
                    key={collection.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 16px",
                      margin: "10px 0px",
                      boxShadow: "0px 0px 20px 3px #7e9aa926",
                      borderRadius: "10px",
                      background: `${themeType === "light" ? "white" : "black"}`,
                      cursor: "pointer",
                    }}
                    onClick={() => setCollection(collection)}
                  >
                    <Badge
                      badgeContent={collection.ownedCount}
                      color="secondary"
                      overlap="circular"
                      componentsProps={{
                        badge: {
                          style: {
                            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                          },
                        },
                      }}
                    >
                      <Avatar
                        src={collection.imageUrl}
                        sx={{
                          borderRadius: "50px",
                          border: "3px solid #fff",
                          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                          margin: "0 10px 0 0",
                          height: "60px",
                          width: "60px",
                        }}
                      />
                    </Badge>
                    <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                      {collection.name}
                    </span>
                  </Box>
                );
              })}
            {(searchedAssets.isFetching || (assets && assets?.length > 0)) && (
              <Typography sx={{ marginBottom: "10px" }}>Items</Typography>
            )}
            {searchedAssets.isFetching && (
              <Box className="flex fr fj-c">
                <CircularProgress
                  sx={{
                    margin: "20px",
                    width: "30px !important",
                    height: "30px !important",
                  }}
                />
              </Box>
            )}
            {!searchedAssets.isFetching &&
              assets &&
              assets?.slice(0, 3).map((asset) => {
                return (
                  <Link
                    to={`/asset/${asset.assetContractAddress}/${asset.tokenId}`}
                    key={asset.name}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 16px",
                        margin: "10px 0px",
                        boxShadow: "0px 0px 20px 3px #7e9aa926",
                        borderRadius: "10px",
                        background: `${themeType === "light" ? "white" : "black"}`,
                        cursor: "pointer",
                        color: `${themeType === "light" ? "black" : "white"}`,
                      }}
                    >
                      <Avatar
                        src={asset.imageUrl || asset.frameUrl || asset.thumbUrl || ""}
                        sx={{
                          borderRadius: "50px",
                          border: "3px solid #fff",
                          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                          margin: "0 10px 0 0",
                          height: "60px",
                          width: "60px",
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                          {asset.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            opacity: "0.8",
                          }}
                        >
                          {
                            collections?.find(
                              (item) =>
                                item.contractAddress === asset.assetContractAddress
                            )?.name
                          }
                        </span>
                      </Box>
                    </Box>
                  </Link>
                );
              })}
          </Box>
        )}
    </Box>
  );
};

export default BorrowerAssetSearch;

function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
