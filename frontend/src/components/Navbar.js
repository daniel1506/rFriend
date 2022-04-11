//this navbar component can switch between admin and normal user verion, example below shows how to activate admin mode:
//<Navbar admin />
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoutButton from "./LogoutButton";
import Button from "@mui/material/Button";
import NameShowCase from "./NameShowCase";
import AuthContext from "../store/auth-context";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Avatar from "@mui/material/Avatar";
import FriendShowCase from "./FriendShowCase";
import FriendList from "./FriendList";
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { set } from "date-fns";
import LogoutIcon from "@mui/icons-material/Logout";
import get from "../lib/get";
import AddFriendField from "./AddFriendField";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import GeneralContext from "../store/general-context";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const drawerIconSize = 28;

export default function Navbar(props) {
  //get context by itself here, make the module more self-contained, reduce coupling
  const authCtx = useContext(AuthContext);
  const generalCtx = useContext(GeneralContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isPageMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePageMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handlePageMenuClose = () => {
    setAnchorEl2(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = "primary-search-account-menu";
  const pageMenuId = "page-menu";
  const renderPageMenu = (
    <SwipeableDrawer
      open={openDrawer}
      onClose={() => {
        setOpenDrawer(false);
      }}
      onOpen={() => {
        setOpenDrawer(true);
      }}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => {
          setOpenDrawer(false);
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              props.setShowCreateEvent(true);
            }}
          >
            <ListItemIcon>
              <AddCircleIcon sx={{ height: drawerIconSize, width: drawerIconSize }} color="info" />
            </ListItemIcon>
            <ListItemText primary={"Create event"} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ ml: 2, textTransform: "uppercase", py: 1, display: "block" }}>
            Browse Events
          </Typography>
          <ListItem
            button
            onClick={() => {
              generalCtx.handleChangeView("gridView");
            }}
          >
            <ListItemIcon>
              <ViewListIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>Grid view</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => {
              generalCtx.handleChangeView("mapView");
            }}
          >
            <ListItemIcon>
              <TravelExploreIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>Map view</ListItemText>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem
            button
            onClick={() => {
              generalCtx.handleChangeView("myEvents");
            }}
          >
            <ListItemIcon>
              <CalendarMonthIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>My Events</ListItemText>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ ml: 2, textTransform: "uppercase", pt: 1, display: "block" }}>
            Friends
          </Typography>
          <ListItem>
            <AddFriendField />
          </ListItem>
          <FriendList />
        </List>
      </Box>
    </SwipeableDrawer>
  );
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          props.setShowProfile(true);
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          props.onLogout();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      {/* <MenuItem
        onClick={() => {
          generalCtx.handleChangeView();
        }}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        {generalCtx.isMapView && (
          <Button color="inherit" startIcon={<TravelExploreIcon />}>
            Map view
          </Button>
        )}
        {!generalCtx.isMapView && (
          <Button color="inherit" startIcon={<CalendarMonthIcon />}>
            {" "}
            Calendar view
          </Button>
        )}
      </MenuItem> */}
      <MenuItem
        onClick={() => {
          props.setShowProfile(true);
        }}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <NameShowCase variant="text">{authCtx.name}</NameShowCase>
      </MenuItem>
      <MenuItem
        onClick={() => {
          authCtx.logout();
        }}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <LogoutButton variant="text" />
      </MenuItem>
    </Menu>
  );
  const rFriendIcon = (
    <svg
      width="30"
      zoomAndPan="magnify"
      viewBox="0 0 375 374.999991"
      height="30"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      className="rFriend"
    >
      <defs>
        <clipPath id="id1">
          <path d="M 24 143 L 333 143 L 333 367.132812 L 24 367.132812 Z M 24 143 " clipRule="nonzero" fill="whitle" />
        </clipPath>
        <clipPath id="id2">
          <path
            d="M 22.578125 7.882812 L 307 7.882812 L 307 123 L 22.578125 123 Z M 22.578125 7.882812 "
            clipRule="nonzero"
            fill="whitle"
          />
        </clipPath>
        <clipPath id="id3">
          <path d="M 297 75 L 352.578125 75 L 352.578125 130 L 297 130 Z M 297 75 " clipRule="nonzero" fill="whitle" />
        </clipPath>
      </defs>
      <g clipPath="url(#id1)">
        <path
          fill="rgb(0%, 0%, 0%)"
          d="M 164.5625 367.132812 C 142.765625 367.132812 96.511719 352.6875 92.996094 343.722656 C 88.546875 332.386719 95.109375 306.84375 94.847656 294.136719 C 94.4375 274.882812 89.910156 255.273438 80.046875 238.578125 C 66.074219 214.917969 46.042969 195.1875 33.144531 170.808594 C 30.183594 165.210938 26.742188 159.359375 25.320312 153.125 C 24.796875 150.8125 24.320312 147.84375 25.957031 145.824219 C 27.183594 144.304688 29.035156 143.730469 30.925781 143.730469 C 32.273438 143.730469 33.640625 144.023438 34.828125 144.46875 C 41.476562 146.984375 47.015625 152.277344 52.160156 156.984375 C 74.285156 177.214844 92.097656 200.464844 120.554688 212.308594 C 150.152344 224.628906 182.964844 226.867188 201.878906 226.867188 C 208.113281 226.867188 212.828125 226.625 215.433594 226.417969 C 220.777344 225.996094 226.335938 225.589844 231.1875 225.589844 C 232.433594 225.589844 233.625 225.617188 234.757812 225.679688 C 236.777344 225.042969 238.855469 224.351562 241.015625 223.609375 C 256.953125 218.101562 292.726562 203.972656 315.078125 169.757812 C 317.140625 166.597656 320.539062 164.5 323.832031 164.5 C 326.027344 164.5 328.175781 165.425781 329.851562 167.59375 C 335.613281 174.976562 331.261719 187.550781 328.851562 196.109375 C 324.398438 211.894531 319.695312 224.132812 314.214844 239.523438 C 303.007812 270.988281 314.367188 334.195312 312.175781 343.769531 C 310.753906 349.988281 267.417969 365.515625 245.523438 365.515625 C 241.621094 365.515625 238.410156 365.027344 236.230469 363.902344 C 235.746094 363.652344 235.3125 363.371094 234.933594 363.054688 C 230.878906 359.679688 229.585938 327.292969 226.019531 312.785156 C 225.03125 308.777344 223.808594 304.738281 222.242188 300.851562 C 220.472656 296.476562 218.257812 292.300781 215.4375 288.589844 C 212.84375 285.171875 209.722656 282.148438 205.964844 279.726562 C 203.066406 277.863281 200.109375 276.25 197.101562 274.828125 C 196.242188 275.777344 195.410156 276.757812 194.609375 277.78125 C 192.617188 280.300781 190.988281 283.011719 189.613281 285.847656 C 186.9375 291.390625 185.257812 297.429688 183.9375 303.523438 C 183.0625 307.5625 182.34375 311.621094 181.589844 315.566406 C 178.285156 332.976562 178.359375 359.03125 175.289062 364.082031 C 175.210938 364.199219 175.144531 364.308594 175.058594 364.40625 C 173.539062 366.304688 169.742188 367.125 164.558594 367.125 Z M 154.214844 201.191406 C 140.667969 201.191406 129.675781 190.195312 129.675781 176.660156 C 129.675781 163.121094 140.667969 152.125 154.214844 152.125 C 167.753906 152.125 178.753906 163.121094 178.753906 176.660156 C 178.753906 190.195312 167.753906 201.191406 154.214844 201.191406 Z M 242.453125 201.902344 C 228.910156 201.902344 217.910156 190.90625 217.910156 177.363281 C 217.910156 163.832031 228.910156 152.835938 242.453125 152.835938 C 256 152.835938 267 163.832031 267 177.363281 C 267 190.90625 256 201.902344 242.453125 201.902344 Z M 242.453125 201.902344 "
          fillOpacity="1"
          fillRule="nonzero"
          fill="white"
        />
      </g>
      <g clipPath="url(#id2)">
        <path
          fill="rgb(100%, 87.059021%, 34.899902%)"
          d="M 194.394531 8.371094 C 116.085938 2.421875 46.289062 51.289062 22.664062 122.597656 C 52.988281 65.742188 114.871094 29.113281 183.261719 34.308594 C 222.683594 37.304688 257.855469 53.730469 284.6875 78.738281 C 290.273438 83.941406 299.121094 83.214844 303.871094 77.238281 C 307.976562 72.0625 307.550781 64.679688 302.984375 59.886719 C 275.402344 30.921875 237.4375 11.644531 194.394531 8.371094 Z M 194.394531 8.371094 "
          fillOpacity="1"
          fillRule="nonzero"
          fill="white"
        />
      </g>
      <g clipPath="url(#id3)">
        <path
          fill="rgb(100%, 87.059021%, 34.899902%)"
          d="M 328.589844 77.054688 L 334.148438 90.855469 C 334.464844 91.636719 335.140625 92.210938 335.964844 92.402344 L 350.492188 95.648438 C 352.5625 96.109375 353.199219 98.746094 351.574219 100.097656 L 340.15625 109.652344 C 339.511719 110.195312 339.175781 111.011719 339.25 111.851562 L 340.652344 126.671875 C 340.84375 128.777344 338.539062 130.199219 336.75 129.074219 L 324.136719 121.167969 C 323.425781 120.722656 322.539062 120.652344 321.761719 120.992188 L 308.097656 126.898438 C 306.148438 127.742188 304.085938 125.988281 304.601562 123.9375 L 308.226562 109.5 C 308.425781 108.675781 308.21875 107.820312 307.667969 107.1875 L 297.820312 96.019531 C 296.417969 94.433594 297.449219 91.925781 299.5625 91.78125 L 314.421875 90.765625 C 315.257812 90.703125 316.015625 90.234375 316.445312 89.519531 L 324.023438 76.714844 C 325.101562 74.894531 327.800781 75.09375 328.597656 77.058594 Z M 328.589844 77.054688 "
          fillOpacity="1"
          fillRule="nonzero"
          fill="white"
        />
      </g>
    </svg>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={props.admin ? { background: "black" } : {}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            aria-controls={pageMenuId}
            aria-haspopup="true"
            onClick={() => {
              //the ui in drawer is useless for admin, so we don't allow the drawer to open if it's admin case
              if (!props.admin) setOpenDrawer(true);
            }}
            sx={{}}
          >
            <MenuIcon />
          </IconButton>
          {/* <Avatar
            src={RFriendIcon}
            sx={{ display: { xs: "none", sm: "block" } }}
          /> */}
          {rFriendIcon}
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
            rFriend
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={props.admin ? "Search username" : "Search event"}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                props.handleSearch(e.target.value);
              }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: { md: "row" },
              alignItems: { md: "center" },
              gap: 2,
            }}
          >
            {/* {!props.admin && (
              <>
                {generalCtx.isMapView && (
                  <Button
                    color="inherit"
                    startIcon={<TravelExploreIcon />}
                    onClick={() => {
                      generalCtx.handleChangeView();
                    }}
                  >
                    Map view
                  </Button>
                )}
                {!generalCtx.isMapView && (
                  <Button
                    color="inherit"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => {
                      generalCtx.handleChangeView();
                    }}
                  >
                    Calendar view
                  </Button>
                )}
              </>
            )} */}
            <NameShowCase
              color="inherit"
              variant="text"
              onClick={() => {
                handleMenuClose();
                props.setShowProfile(true);
              }}
            >
              {authCtx.name}
            </NameShowCase>
            <LogoutButton
              color="inherit"
              onClick={() => {
                handleMenuClose();
                props.onLogout();
              }}
            />

            {/* <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            ></IconButton> */}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderPageMenu}
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
