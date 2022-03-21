import { React, useState } from "react";
import TextField from "@mui/material/TextField";
function PasswordInput(props) {
  const [passwordError, setPasswordError] = useState(false);
  const validatePassword = (e) => {
    let password = e.target.value;
    if (password.length < 8) {
      setPasswordError(true);
    } else setPasswordError(false);
  };
  return (
    <TextField
      id="passwordReg"
      type="password"
      label={props.label ? props.label : "password"} //if props.label is given, then dispaly props.label, else display defaut i.e. "password"
      className="info-input"
      error={passwordError}
      helperText={
        passwordError && !props.noHelperText
          ? "Length must be larger than 8"
          : ""
      }
      onChange={(e) => {
        props.setPassword(e.target.value);
        validatePassword(e);
      }}
      {...props}
    />
  );
}

export default PasswordInput;
