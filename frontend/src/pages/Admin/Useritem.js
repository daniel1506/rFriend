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
            <Grid
              container
              direction={{ xs: "row" }}
              alignItems="center"
              justifyContent={{ xs: "space-between" }}
              gap={{ sm: 2, xs: 0 }}
            >
              <Grid item>
                <Grid
                  container
                  direction={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  justifyContent={{ xs: "start" }}
                  gap={{ sm: 2, xs: 0 }}
                >
                  <AccountCircleIcon />
                  <ShortText>user</ShortText>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "end" }}
                  justifyContent={{ xs: "end" }}
                  gap={{ sm: 2, xs: 1 }}
                >
                  <Button
                    variant="contained"
                    endIcon={<LockResetIcon />}
                    color="warning"
                  >
                    Reset password
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<BlockIcon />}
                    color="error"
                  >
                    Ban
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default Useritem;
