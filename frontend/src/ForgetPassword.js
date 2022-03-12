//@ts-check
import { React, useState } from "react";
import {
  Button,
  Grid,
  Slide,
  Input,
  TextField,
  FormControl,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
function ForgetPassword(props) {
  return (
    <>
      <Button onClick={props.handleForget}>
        <KeyIcon />
        Forgot password?
      </Button>
      <Slide direction="up" in={props.forgetChecked} mountOnEnter unmountOnExit>
        <form>
          <TextField
            error={props.emailError}
            type="email"
            helperText={props.emailError ? "Invalid email" : ""}
            id="forget"
            label="email"
            className="info-input"
            onChange={(e) => {
              props.validateEmail(e);
            }}
          />
          <Button type="submit">submit</Button>
        </form>
      </Slide>
    </>
  );
}

export default ForgetPassword;
