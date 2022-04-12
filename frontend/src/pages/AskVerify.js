import React, { useContext } from "react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { Typography, Box, Button } from "@mui/material";
import VerticalFlex from "../layout/VerticalFlex";
import AuthContext from "../store/auth-context";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import redirectToMailBox from "../lib/redirectToMailBox";
function AskVerify() {
  let authCtx = useContext(AuthContext);
  return (
    <VerticalFlex height="100%" gap={2}>
      <MarkEmailUnreadIcon sx={{ fontSize: "200px" }} />
      <Typography variant="h3">You are not verified, please check your email</Typography>
      <Button
        variant="contained"
        color="warning"
        onClick={() => {
          redirectToMailBox(authCtx.email);
        }}
      >
        Check your email
      </Button>
      <Button
        endIcon={<ExitToAppIcon />}
        onClick={() => {
          authCtx.logout();
        }}
      >
        Login page
      </Button>
    </VerticalFlex>
  );
}

export default AskVerify;
