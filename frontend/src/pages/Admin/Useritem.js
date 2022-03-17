import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ShortText from "../../components/ShortText";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import BlockIcon from "@mui/icons-material/Block";
import LockResetIcon from "@mui/icons-material/LockReset";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
function Useritem(props) {
  return (
    <ListItem disablePadding>
      <ListItemButton component="a" href="#simple-list">
        <ListItemText
          primary={
            <Grid container direction={{ xs: "row" }} alignItems="center">
              <AccountCircleIcon />
              <ShortText sx={{ marginLeft: 2 }}>user</ShortText>
            </Grid>
          }
        />
        <Button
          variant="contained"
          endIcon={<BlockIcon />}
          sx={{ marginRight: 2 }}
        >
          Ban
        </Button>
        <Button variant="contained" endIcon={<LockResetIcon />}>
          Reset password
        </Button>
      </ListItemButton>
    </ListItem>
  );
}

export default Useritem;
