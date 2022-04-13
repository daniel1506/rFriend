import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from "@mui/material";
function CfPasswordInput(props) {
  const [cfPassword, setCfPassword] = useState("");
  const [cfPasswordError, setCfPasswordError] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);
  const confirmPassword = (e) => {
    let cfPassword = e.target.value;
    if (cfPassword == props.password) {
      setCfPasswordError(false);
    } else {
      setCfPasswordError(true);
    }
  };
  const handleMouseDownCfPassword = (event) => {
    event.preventDefault();
  };
  return (
    <FormControl variant="outlined" sx={{ width: "210px" }}>
      <InputLabel htmlFor="outlined-adornment-cfpassword" color={cfPasswordError && "error"}>
        {props.label ? props.label : "confirm password"}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-cfpassword"
        type={showCfPassword ? "text" : "password"}
        value={cfPassword}
        error={cfPasswordError}
        onChange={(e) => {
          setCfPassword(e.target.value);
          confirmPassword(e);
          props.setCfPasswordError(cfPasswordError);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShowCfPassword((prev) => {
                  return !prev;
                });
              }}
              onMouseDown={handleMouseDownCfPassword}
              edge="end"
            >
              {showCfPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
        label="confirm password"
      />
      <FormHelperText id="outlined-weight-helper-text-cf" sx={{ color: "#d32f2f" }}>
        {cfPasswordError && !props.noHelperText ? "Must has at least 8 characters" : ""}
      </FormHelperText>
    </FormControl>
  );
}

export default CfPasswordInput;
