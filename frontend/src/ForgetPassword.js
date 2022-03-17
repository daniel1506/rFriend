//@ts-check
import { useState } from "react";
import { Button, Slide, Input, TextField, FormControl } from "@mui/material";
import VerticalFlex from "./layout/VerticalFlex";
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
          <VerticalFlex
            container
            direction="column"
            alignItems="center"
            justify="center"
            gap="10px"
            marginTop="10px"
          >
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
          </VerticalFlex>
        </form>
      </Slide>
    </>
  );
}

export default ForgetPassword;
