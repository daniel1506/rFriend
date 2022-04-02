import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";

function CrossButton(props) {
  return (
    <IconButton
      aria-label="cross"
      onClick={props.handleClose}
      sx={{ position: "absolute", top: 10, right: 10 }}
      {...props}
    >
      <CancelIcon />
    </IconButton>
  );
}

export default CrossButton;
