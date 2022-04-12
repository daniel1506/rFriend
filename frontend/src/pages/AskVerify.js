import React from "react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { Typography, Box } from "@mui/material";
import VerticalFlex from "../layout/VerticalFlex";
function AskVerify() {
  return (
    <VerticalFlex height="100%">
      <MarkEmailUnreadIcon sx={{ fontSize: "200px" }} />
      <Typography variant="h3">You are not verified, please check your email</Typography>
    </VerticalFlex>
  );
}

export default AskVerify;
