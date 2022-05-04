import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from "@mui/material";
function PasswordInput(props) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validatePassword = (e) => {
    let password = e.target.value;
    if (password.length < 8) {
      setPasswordError(true);
    } else setPasswordError(false);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //-------------------------------------------------------------- */
  return (
    <FormControl
      variant="outlined"
      sx={{ width: "210px" }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <InputLabel htmlFor="outlined-adornment-password" color={passwordError && "error"}>
        {props.label ? props.label : "password"}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={password}
        error={passwordError}
        onChange={(e) => {
          props.setPassword(e.target.value);
          setPassword(e.target.value);
          validatePassword(e);
          props.setPasswordError(passwordError);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShowPassword((prev) => {
                  return !prev;
                });
              }}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label ? props.label : "password"}
      />
      <FormHelperText id="outlined-weight-helper-text" sx={{ color: "#d32f2f" }}>
        {passwordError && !props.noHelperText ? "Must has at least 8 characters" : ""}
      </FormHelperText>
    </FormControl>
  );
}

export default PasswordInput;
