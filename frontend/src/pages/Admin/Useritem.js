import { React, useState } from "react";
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
import Card from "@mui/material/Card";
import SubmitButton from "../../components/SubmitButton";
import { TextField, Box } from "@mui/material";
import put from "../../lib/put";
import Progress from "../../components/Progress";
import { set } from "date-fns";
function Useritem(props) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const clearProgress = () => {
    setLoading(null);
    setError(null);
  };
  const reset = (user_id, password) => {
    const data = { user_id, password };
    setLoading(true);
    put("https://rfriend.herokuapp.com/api/admin", data)
      .then((result) => {
        console.log(result);
        if (result.status != 200) setError(true);
        else setError(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Card>
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
                    <ShortText>{props.name}</ShortText>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "end", md: "center" }}
                    justifyContent={{ xs: "end" }}
                    gap={{ sm: 2, xs: 1 }}
                  >
                    {loading && <Progress loading={loading} error={error} />}
                    <TextField
                      label="new password"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<LockResetIcon />}
                      color="warning"
                      onClick={(e) => {
                        clearProgress();
                        reset(props.userid, newPassword);
                      }}
                    >
                      Reset password
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<BlockIcon />}
                      color="error"
                      onClick={() => {
                        props.ban(props.userid);
                      }}
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
    </Card>
  );
}

export default Useritem;
