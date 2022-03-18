import { React, useState } from "react";
import TextField from "@mui/material/TextField";
function CfPasswordInput(props) {
  const [cfPasswordError, setCfPasswordError] = useState(false);
  const confirmPassword = (e) => {
    let cfPassword = e.target.value;
    if (cfPassword == props.password) {
      setCfPasswordError(false);
    } else {
      setCfPasswordError(true);
    }
  };
  return (
    <TextField
      error={cfPasswordError}
      helperText={cfPasswordError ? "Doesn't match" : ""}
      type="password"
      label="confirm password"
      className="info-input"
      onChange={(e) => {
        confirmPassword(e);
      }}
    />
  );
}

export default CfPasswordInput;
