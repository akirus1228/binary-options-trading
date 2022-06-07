import { Avatar, List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useGetCollectionsQuery } from "../../api/backend-api";
import { ListingQueryParam } from "../../store/reducers/interfaces";
import { BackendAssetQueryParams, Collection } from "../../types/backend-types";
import style from "./collections-filter.module.scss";

export interface CollectionsFilterProps {
  collection: Collection;
  setCollection: Dispatch<SetStateAction<Collection>>;
}

export const CollectionsFilter = ({
  collection,
  setCollection,
}: CollectionsFilterProps): JSX.Element => {
  const { data: collections, isLoading } = useGetCollectionsQuery({});
  const handleCollectionClick = useCallback(
    (collection: Collection) => {
      setCollection(collection);
    },
    [collection, setCollection]
  );
  return (
    <List component="nav" subheader={<ListSubheader>Collections</ListSubheader>}>
      {collections?.map((collectionMap: Collection) => (
        <ListItemButton
          onClick={() => {
            handleCollectionClick(collectionMap);
          }}
          selected={collection.slug === collectionMap.slug}
        >
          <Avatar src={collectionMap.imageUrl} />
          <ListItemText primary={collectionMap.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default CollectionsFilter;
