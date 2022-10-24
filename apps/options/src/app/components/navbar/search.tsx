import { SvgIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <div className="xs:hidden lg:flex rounded-3xl items-center text-primary border-solid border-2 border-second xs:py-5 xs:px-10 md:px-5 ml-20">
      <SvgIcon className="text-18" component={SearchIcon} />
      <div className="px-5">
        <input
          type="text"
          className="xs:text-10 md:text-16 w-140 outline-none bg-bunker text-primary"
          placeholder="Search for token"
        />
      </div>
    </div>
  );
};

export default SearchBar;
