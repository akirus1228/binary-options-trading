import { Avatar, List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useGetCollectionsQuery } from "../../api/backend-api";
import { BackendAssetQueryParams, Collection } from "../../types/backend-types";
import style from "./collections-filter.module.scss";

export interface CollectionsFilterProps {
  query: BackendAssetQueryParams;
  setQuery: Dispatch<SetStateAction<BackendAssetQueryParams>>;
}

export const CollectionsFilter = (props: CollectionsFilterProps): JSX.Element => {
  const { data: collections, isLoading } = useGetCollectionsQuery({});
  return (
    <List component="nav" subheader={<ListSubheader>Collections</ListSubheader>}>
      {collections?.map((collection: Collection) => (
        <ListItemButton>
          <Avatar src={collection.imageUrl} />
          <ListItemText primary={collection.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default CollectionsFilter;
