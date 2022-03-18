import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
function EmailShowCase(props) {
  return (
    <Button
      variant="outlined"
      startIcon={<EmailIcon />}
      sx={{ textTransform: "none" }}
    >
      {props.children}
    </Button>
  );
}

export default EmailShowCase;
