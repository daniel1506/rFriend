//@ts-check
import { Button, ButtonGroup, Slide, TextField, Grid } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ForgetPassword from "./ForgetPassword.js";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import * as React from "react";
import "./App.css";
import Axios from "axios";
import validator from "validator";
function Logreg() {
  const [logChecked, setLogChecked] = React.useState(false);
  const [regChecked, setRegChecked] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [emailError, setEmailError] = React.useState(false);
  const [logEmailError, setLogEmailError] = React.useState(false);
  const [password, setPassword] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(false);
  const [cfPassword, setCfPassword] = React.useState(null);
  const [fail, setFail] = React.useState(false);
  const handleLog = () => {
    setLogChecked((prev) => !prev);
    setRegChecked(false);
  };
  const handleReg = () => {
    setRegChecked((prev) => !prev);
    setLogChecked(false);
  };
  //provide validity checking for both email input at login & email input at register
  const validateEmail = (e) => {
    var email = e.target.value;

    if (validator.isEmail(email) && logChecked == true) {
      setLogEmailError(false);
    }
    if (!validator.isEmail(email) && logChecked == true) {
      setLogEmailError(true);
    }
    if (validator.isEmail(email) && regChecked == true) {
      setEmailError(false);
    }
    if (!validator.isEmail(email) && regChecked == true) {
      setEmailError(true);
    }
  };
  const validatePassword = (e) => {
    var cfPassword = e.target.value;

    if (cfPassword == password) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  const addUser = () => {
    console.log({ email, username, password });
    Axios.post("/api/user/register", { email, username, password })
      .then((response) => {
        console.log("done");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        className="regloggroup"
      >
        <Button className="reglog" onClick={handleLog}>
          <LoginIcon />
          Login
        </Button>
        <Button className="reglog" onClick={handleReg}>
          <AppRegistrationIcon />
          Register
        </Button>
      </ButtonGroup>
      <ForgetPassword />
      <Slide
        direction="up"
        in={logChecked}
        mountOnEnter
        unmountOnExit
        className="info-input-container"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          gap="10px"
          marginTop="10px"
        >
          <TextField
            error={logEmailError}
            type="email"
            helperText={logEmailError ? "Invalid email" : ""}
            id="emailLog"
            label="email"
            className="info-input"
            onChange={(e) => {
              setPassword(e.target.value);
              validateEmail(e);
            }}
          />
          <TextField
            id="passwordlog"
            type="password"
            label="password"
            className="info-input"
          />
          <Button>Submit</Button>
        </Grid>
      </Slide>
      <Slide
        direction="up"
        in={regChecked}
        mountOnEnter
        unmountOnExit
        className="info-input-container"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          gap="10px"
          marginTop="10px"
        >
          <TextField
            id="emailReg"
            error={emailError}
            helperText={emailError ? "Invalid email" : ""}
            type="email"
            label="email"
            className="email-input"
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e);
            }}
          />
          <TextField
            id="usernameReg"
            label="username"
            className="info-input"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            id="passwordReg"
            type="password"
            label="password"
            className="info-input"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            id="cfPasswordReg"
            error={passwordError}
            helperText={passwordError ? "Doesn't match" : ""}
            type="password"
            label="confirm password"
            className="info-input"
            onChange={(e) => {
              setCfPassword(e.target.value);
              validatePassword(e);
            }}
          />
          <Button onClick={addUser}>Submit</Button>
        </Grid>
      </Slide>
    </>
  );
}
export default Logreg;
