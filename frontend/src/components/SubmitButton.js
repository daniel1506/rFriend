import React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
function SubmitButton(props) {
  return (
    <LoadingButton variant="contained" endIcon={<SendIcon />} {...props}>
      {props.children}
    </LoadingButton>
  );
}

export default SubmitButton;
