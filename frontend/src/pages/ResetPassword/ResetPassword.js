//@ts-check
//This page is deprecated
import React from "react";
import { useState, useEffect } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Box, Typography, Fade } from "@mui/material";
function ResetPassword() {
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
        <LockResetIcon sx={{ fontSize: "200px" }} />
      </Fade>
      <Typography variant="h3">Reset Password</Typography>
      <Typography variant="h6">Please check your email</Typography>
    </Box>
  );
}

export default ResetPassword;
