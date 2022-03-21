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
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns/esm";
import post from "./lib/post";
import PasswordInput from "./components/PasswordInput";
import CfPasswordInput from "./components/CfPasswordInput";
import EmailInput from "./components/EmailInput";
import NameInput from "./components/NameInput";
import SubmitButton from "./components/SubmitButton";
import AuthContext from "./store/auth-context";
function Logreg() {
  const [logChecked, setLogChecked] = React.useState(false);
  const [regChecked, setRegChecked] = React.useState(false);
  const [forgetChecked, setForgetChecked] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState(null);
  const [fail, setFail] = React.useState(false);
  const [failMessage, setFailMessage] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
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
  //provide validity checking for email input at register
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
        console.log("Response:", data);
        if (data.status != 201) {
          setFail(true);
          setFailMessage(data.message);
        } else {
          authCtx.login(data.token, data.id, data.email, data.name);
        }
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
        console.log("Response:", data);
        if (data.status != 200) {
          setFail(true);
          setFailMessage(data.message);
        } else {
          authCtx.login(data.token, data.id, data.email, data.name);
        }
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
            <EmailInput setEmail={setEmail} />
            <PasswordInput setPassword={setPassword} />
            <SubmitButton loading={submitting} type="submit">
              Submit
            </SubmitButton>
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
            <EmailInput setEmail={setEmail} />
            <NameInput setUsername={setUsername} />
            <PasswordInput setPassword={setPassword} />
            <CfPasswordInput password={password} />
            <SubmitButton type="submit" loading={submitting}>
              Submit
            </SubmitButton>
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
    </>
  );
}
export default Logreg;
