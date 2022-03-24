//@ts-check
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
import deleteReq from "../../lib/delete";
import ResultDisplay from "../../components/ResultDisplay";
import { set } from "date-fns";
import PasswordInput from "../../components/PasswordInput";
import Grow from "@mui/material/Grow";
function Useritem(props) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [banning, setBanning] = useState(null);
  const [banError, setBanError] = useState(null);
  const clearProgress = () => {
    setLoading(null);
    setError(null);
  };
  const reset = (user_id, password) => {
    //sending request to reset user password
    const data = { user_id, password };
    console.log(data);
    setLoading(true);
    put("https://rfriend.herokuapp.com/api/admin", data)
      .then((result) => {
        console.log(result);
        if (result.status != 200) setError(true);
        else setError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ban = (user_id) => {
    //sending request to ban user
    const data = { user_id };
    console.log(data);
    setBanning(true);
    deleteReq("https://rfriend.herokuapp.com/api/admin/", data)
      .then((result) => {
        console.log(result);
        if (result.status != 200) setBanError(true);
        else {
          setBanError(false);
          props.setBanned((prev) => {
            return prev + 1;
          });
        }
        setBanning(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Grow in={true} timeout={500}>
      <Card sx={{ marginBottom: 2 }}>
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
                      <ShortText color="primary">{`#${props.userid}`}</ShortText>
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
                      <PasswordInput
                        noHelperText
                        label="new password"
                        setPassword={setNewPassword}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "row" },
                          alignItems: "center",
                        }}
                      >
                        <ResultDisplay error={error} color="warning" />
                        <SubmitButton
                          variant="contained"
                          endIcon={<LockResetIcon />}
                          color="warning"
                          onClick={(e) => {
                            clearProgress();
                            reset(props.userid, newPassword);
                          }}
                          loading={loading}
                        >
                          Reset password
                        </SubmitButton>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "row" },
                          alignItems: "center",
                        }}
                      >
                        <ResultDisplay error={banError} color="error" />
                        <SubmitButton
                          variant="contained"
                          endIcon={<BlockIcon />}
                          loading={banning}
                          color="error"
                          onClick={() => {
                            ban(props.userid);
                          }}
                        >
                          Ban
                        </SubmitButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
          </ListItemButton>
        </ListItem>
      </Card>
    </Grow>
  );
}

export default Useritem;
