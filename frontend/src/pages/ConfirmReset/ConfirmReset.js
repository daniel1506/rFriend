//@ts-check
import { React, useState, useEffect } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Typography, Zoom, Button, Alert } from "@mui/material";
import PasswordInput from "../../components/PasswordInput";
import CfPasswordInput from "../../components/CfPasswordInput";
import SubmitButton from "../../components/SubmitButton";
import { useNavigate, useParams } from "react-router-dom";
import post from "../../lib/post";
function ConfirmReset() {
  let token = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  console.log(window.location.href);
  const submitPassword = () => {
    // const currentUrl = window.location.href;
    // const splittedCurrentUrl = currentUrl.split("/");
    // const resetToken = splittedCurrentUrl[splittedCurrentUrl.length - 1];
    // console.log(resetToken);
    let data = { token, password };
    setLoading(true);
    post("https://rfriend.herokuapp.com/api/user/pw_reset", data)
      .then((result) => {
        if (result.status != 200) {
          setLoading(false);
          setFailed(true);
          setSuccess(false);
          setFailedMessage(result.message);
        } else {
          setSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Zoom
        in={!loading}
        timeout={500}
        sx={{ display: !success ? "block" : "none" }}
      >
        <Button style={{ pointerEvents: "none" }}>
          <LockResetIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      <Zoom
        in={success}
        timeout={500}
        sx={{ display: success ? "block" : "none" }}
      >
        <Button style={{ pointerEvents: "none" }}>
          <DoneIcon sx={{ fontSize: "200px" }} color="success" />
        </Button>
      </Zoom>
      <Typography variant="h3">Enter your new password</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <PasswordInput setPassword={setPassword} />
        <CfPasswordInput password={password} />
        <SubmitButton onClick={submitPassword} disabled={success}>
          Submit
        </SubmitButton>
        {failed && <Alert severity="error">{failedMessage}</Alert>}
      </Box>
    </Box>
  );
}

export default ConfirmReset;
