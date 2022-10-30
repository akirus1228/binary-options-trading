import { SvgIcon, MenuItem, Menu, Button } from "@mui/material";
import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { CurrencyDetails, CurrencyInfo } from "@fantohm/shared-web3";
import { useState, MouseEvent, Dispatch, SetStateAction } from "react";

import { LabelIcon } from "../label-icon/label-icon";

interface CurrencyDropDownProps {
  currencies: CurrencyInfo;
  selectedCurrency: CurrencyDetails;
  setCurrency: Dispatch<SetStateAction<CurrencyDetails>>;
}

export const CurrencyDropdown = (props: CurrencyDropDownProps) => {
  const { selectedCurrency, setCurrency, currencies } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleDropDownOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };
  const handleDropDownClose = () => {
    setAnchorEl(null);
    setOpen(!open);
  };

  const handleMenuItemClick = (currency: CurrencyDetails) => {
    setAnchorEl(null);
    setOpen(!open);
    setCurrency(currency);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleDropDownOpen}
        className="flex items-center rounded-2xl bg-woodsmoke p-10 w-150 justify-between"
      >
        <LabelIcon
          label={selectedCurrency.symbol}
          icon={() => (
            <img
              src={selectedCurrency.icon}
              alt={`${selectedCurrency.symbol} logo`}
              width={35}
            />
          )}
          reverse
          backgroundColor="woodsmoke"
        />
        <SvgIcon
          component={!open ? KeyboardArrowDownOutlined : KeyboardArrowUpOutlined}
          className="text-white ml-5"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleDropDownClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiList-root": {
            padding: "0px",
            backgroundColor: "#0B0F10",
            width: "150px",
          },
          "& .MuiPaper-elevation1": {
            backgroundColor: "#0B0F10",
            py: "5px",
          },
        }}
      >
        {Object.values(currencies).map((currency: CurrencyDetails) => (
          <MenuItem onClick={() => handleMenuItemClick(currency)}>
            <LabelIcon
              label={currency.symbol}
              icon={() => (
                <img src={currency.icon} alt={`${currency.symbol} logo`} width={35} />
              )}
              reverse
              backgroundColor="woodsmoke"
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
