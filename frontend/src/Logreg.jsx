//@ts-check
import {
  Button,
  ButtonGroup,
  Slide,
  TextField,
  Grid,
  FormControl,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VerticalFlex from "./layout/VerticalFlex";
import LoginIcon from "@mui/icons-material/Login";
import ForgetPassword from "./ForgetPassword.js";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import * as React from "react";
import "./App.css";
import Axios from "axios";
import validator from "validator";
import { useEffect } from "react";
import { set } from "date-fns/esm";
import post from "./lib/post";
function Logreg() {
  const [logChecked, setLogChecked] = React.useState(false);
  const [regChecked, setRegChecked] = React.useState(false);
  const [forgetChecked, setForgetChecked] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(false);
  const [cfPasswordError, setcfPasswordError] = React.useState(false);
  const [cfPassword, setCfPassword] = React.useState(null);
  const [fail, setFail] = React.useState(false);
  const [failMessage, setFailMessage] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const handleLog = () => {
    setLogChecked((prev) => !prev);
    setRegChecked(false);
    setForgetChecked(false);
  };
  const handleReg = () => {
    setRegChecked((prev) => !prev);
    setLogChecked(false);
    setForgetChecked(false);
  };
  const handleForget = () => {
    setForgetChecked((prev) => !prev); //used to toggle the value of forgetChecked
    setLogChecked(false);
    setRegChecked(false);
  };
  //provide validity checking for both email input at login & email input at register
  const validateEmail = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  const validatePassword = (e) => {
    let password = e.target.value;
    if (password.length < 8) {
      setPasswordError(true);
    } else setPasswordError(false);
  };
  const confirmPassword = (e) => {
    let cfPassword = e.target.value;
    if (cfPassword == password) {
      setcfPasswordError(false);
    } else {
      setcfPasswordError(true);
    }
  };
  useEffect(() => {
    setEmailError(false);
    setFail(false);
    setFailMessage(null);
  }, [logChecked, regChecked, forgetChecked]); //Reset the error showing flag if the user give up to enter the current information
  const reg = (e) => {
    e.preventDefault();
    setSubmitting(true);
    let data = { email, name: username, password };
    console.log(data);
    post("https://rfriend.herokuapp.com/api/user/register", data)
      .then((data) => {
        if (data.statuscode != 201) {
          setFail(true);
          setFailMessage(data.message);
        }
        console.log("Response:", data);
      })
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const log = (e) => {
    e.preventDefault();
    setSubmitting(true);
    let data = { email, password };
    console.log(data);
    post("https://rfriend.herokuapp.com/api/user/login", data)
      .then((data) => {
        if (data.statuscode != 200) {
          setFail(true);
          setFailMessage(data.message);
        }
        console.log("Response:", data);
      })
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
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
      <ForgetPassword
        handleForget={handleForget}
        forgetChecked={forgetChecked}
        emailError={emailError}
        validateEmail={validateEmail}
      />
      <Slide
        direction="up"
        in={logChecked}
        mountOnEnter
        unmountOnExit
        className="info-input-container"
      >
        {/* login form */}
        <form onSubmit={log}>
          <VerticalFlex>
            <TextField
              error={emailError}
              type="email"
              helperText={emailError ? "Invalid email" : ""}
              id="emailLog"
              label="email"
              className="info-input"
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e);
              }}
            />
            <TextField
              id="passwordlog"
              type="password"
              label="password"
              error={passwordError}
              helperText={passwordError ? "Length must be larger than 8" : ""}
              className="info-input"
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e);
              }}
            />
            {!submitting && <Button type="submit">Submit</Button>}
            {submitting && <LoadingButton loading />}
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
      <Slide
        direction="up"
        in={regChecked}
        mountOnEnter
        unmountOnExit
        className="info-input-container"
      >
        {/* reg form */}
        <form onSubmit={reg}>
          <VerticalFlex>
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
              error={passwordError}
              helperText={passwordError ? "Length must be larger than 8" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e);
              }}
            />
            <TextField
              id="cfPasswordReg"
              error={cfPasswordError}
              helperText={cfPasswordError ? "Doesn't match" : ""}
              type="password"
              label="confirm password"
              className="info-input"
              onChange={(e) => {
                setCfPassword(e.target.value);
                confirmPassword(e);
              }}
            />
            {!submitting && <Button type="submit">Submit</Button>}
            {submitting && <LoadingButton loading />}
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
    </>
  );
}
export default Logreg;
