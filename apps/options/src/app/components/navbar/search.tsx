import { SvgIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { BettingCryptoCurrencies } from "../../core/constants";

const Input = styled("input")(({ theme }) => ({
  width: 130,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  color: theme.palette.mode === "light" ? "#000" : "#fff",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: 200,
  margin: 0,
  padding: 0,
  zIndex: 20,
  position: "absolute",
  left: 20,
  top: 37,
  listStyle: "none",
  overflow: "auto",
  maxHeight: 500,
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const Search = () => {
  const navigate = useNavigate();
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: BettingCryptoCurrencies,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    if (value) {
      navigate(`/trade?underlyingToken=${value.symbol.toLowerCase()}`);
    }
  }, [value]);

  return (
    <div className="xs:hidden lg:block relative">
      <div
        {...getRootProps()}
        className="w-200 flex items-center rounded-3xl focus:rounded-t-xl text-primary border-solid border-2 focus:border-b-0 border-second px-10 py-5 ml-20"
      >
        <SvgIcon component={SearchIcon} />
        <Input
          {...getInputProps()}
          placeholder="Search for a token"
          className="outline-none border-0 bg-bunker text-primary ml-10"
        />
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()} className="bg-bunker">
          {(groupedOptions as typeof BettingCryptoCurrencies).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <div className="flex px-15 py-5">
                <div className="token-logo flex justify-center items-center sm:w-30">
                  <img
                    src={`./assets/images/${option.symbol}.png`}
                    alt={`${option.symbol} logo`}
                  />
                </div>
                <div className="px-10">
                  <p className="betting-token xs:text-15 sm:text-20 text-primary">
                    {option.name}
                  </p>
                  <p className="token-pair xs:text-10 sm:text-16 text-second">
                    {"DAI"}/{option.symbol}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </Listbox>
      ) : null}
    </div>
  );
};

export default Search;
