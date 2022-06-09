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
    (newCollection: Collection) => {
      if (collection.slug === newCollection.slug) {
        setCollection({} as Collection);
      } else {
        setCollection(newCollection);
      }
    },
    [collection, setCollection]
  );
  return (
    <List component="nav" subheader={<ListSubheader>Collections</ListSubheader>}>
      {collections?.map((collectionMap: Collection, index: number) => (
        <ListItemButton
          key={`collection-filter-item-${index}`}
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
