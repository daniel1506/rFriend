//@ts-check
import { useState } from "react";
import {
  Button,
  Slide,
  Input,
  TextField,
  FormControl,
  Alert,
} from "@mui/material";
import VerticalFlex from "./layout/VerticalFlex";
import KeyIcon from "@mui/icons-material/Key";
import post from "./lib/post";
import { LoadingButton } from "@mui/lab";
import EmailInput from "./components/EmailInput";
import SubmitButton from "./components/SubmitButton";
function ForgetPassword(props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [failMessage, setFailMessage] = useState(false);
  const submitForget = (e) => {
    e.preventDefault();
    let data = { email };
    console.log(data);
    setLoading(true);
    post("https://rfriend.herokuapp.com/api/user/forget_pw", data)
      .then((data) => {
        if (data.status != 200) {
          setFail(true);
          setFailMessage(data.message);
        } else setSuccess(true);
        console.log("Response:", data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const redirectToEmailSite = () => {
    let emailDomain = email.split("@")[1];
    window.open(`http://${emailDomain}`, "_blank");
  };
  return (
    <>
      <Button onClick={props.handleForget}>
        <KeyIcon />
        Forgot password?
      </Button>
      <Slide direction="up" in={props.forgetChecked} mountOnEnter unmountOnExit>
        <form onSubmit={submitForget}>
          <VerticalFlex
            container
            direction="column"
            alignItems="center"
            justify="center"
            gap="10px"
          >
            {!success && <EmailInput setEmail={setEmail} />}
            {!success && (
              <SubmitButton type="submit" loading={loading}>
                Submit
              </SubmitButton>
            )}
            {success && (
              <Button
                variant="contained"
                color="warning"
                onClick={redirectToEmailSite}
              >
                Check your email
              </Button>
            )}
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
    </>
  );
}

export default ForgetPassword;
