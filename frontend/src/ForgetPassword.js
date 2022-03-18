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
function ForgetPassword(props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  const [failMessage, setFailMessage] = useState(false);
  const submitForget = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = { email };
    console.log(data);
    post("https://rfriend.herokuapp.com/api/user/forget_pw", data)
      .then((data) => {
        if (data.statuscode != 200) {
          setFail(true);
          setFailMessage(data.message);
        }
        console.log("Response:", data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            marginTop="10px"
          >
            <EmailInput setEmail={setEmail} />
            {!loading && <Button type="submit">submit</Button>}
            {loading && <LoadingButton loading />}
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
    </>
  );
}

export default ForgetPassword;
