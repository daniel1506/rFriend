//@ts-check
import { React, useState, useEffect } from "react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { Box, Typography, Fade } from "@mui/material";
function VerifyEmail() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Fade timeout={1000} in={true}>
        <MarkEmailUnreadIcon sx={{ fontSize: "200px" }} />
      </Fade>
      <Typography variant="h3">Verify Email</Typography>
      <Typography variant="h6">Please check your email</Typography>
    </Box>
  );
}

export default VerifyEmail;
