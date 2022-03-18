import React from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
function SubmitButton(props) {
  return (
    <Button variant="contained" endIcon={<SendIcon />} {...props}>
      {props.children}
    </Button>
  );
}

export default SubmitButton;
