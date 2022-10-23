import { IconButton, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../logo";
import SearchBar from "./search";
import ConnectWallet from "./connect-wallet";
import { NavItemProp } from "../../core/types/types";
import { NavItems } from "../../core/constants";

const Navbar = (): JSX.Element => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div className="w-full xs:h-70 md:h-90 flex justify-between items-center bg-bunker xs:p-5 sm:p-20 text-primary">
      <div className="flex items-center">
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
          className="xs:block md:hidden"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          className="flex flex-col"
          anchorEl={anchorElNav}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            "& .MuiList-root": {
              padding: "0px",
            },
          }}
        >
          {NavItems.map((item: NavItemProp) => (
            <div className="flex justify-center bg-gray-500 text-white px-40 py-10 cursor-default">
              <Link
                onClick={handleCloseNavMenu}
                to={item.href}
                className="cursor-default"
              >
                {item.title}
              </Link>
            </div>
          ))}
        </Menu>
        <Logo />
      </div>
      <SearchBar />
      <div className="xs:hidden md:flex">
        {NavItems.map((items, index) => {
          return (
            <Link
              to={items.href}
              key={index}
              className="h-90 flex items-center xs:text-18 md:20 text-primary xs:px-10 md:px-15 cursor-default border-b-2 border-b-bunker hover:border-b-success"
            >
              {items.title}
            </Link>
          );
        })}
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Navbar;
