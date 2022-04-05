//@ts-check
import { React, useState, useEffect, useContext } from "react";
import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { Box, Typography, Zoom, Button, Alert } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import post from "../../lib/post";
import { useNavigate, useParams } from "react-router-dom";
import VerifyEmail from "../VerifyEmail/VerifyEmail";
import AuthContext from "../../store/auth-context";
function ConfirmEmail() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [clicked, setClicked] = useState(false);
  const [emailFailed, setEmailFailed] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let params = useParams();
  const confirm = () => {
    let data = { token: params.token };
    setLoading(true);
    post("https://rfriend.herokuapp.com/api/user/verify", data).then(
      (result) => {
        console.log(result);
        setLoading(false);
        if (result.status != 200) {
          setEmailFailed(true);
          setErrorMessage(result.message);
        } else {
          setEmailFailed(false);
          setTimeout(() => {
            authCtx.login(
              localStorage.getItem("token"),
              localStorage.getItem("id"),
              localStorage.getItem("email"),
              localStorage.getItem("name"),
              localStorage.getItem("role")
            );
          }, 500);
        }
      }
    );
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
        sx={
          emailFailed === undefined || false
            ? { display: "block" }
            : { display: "none" }
        }
        sx={{ borderRadius: "20px" }}
      >
        <Button
          variant="contained"
          onClick={() => {
            confirm();
          }}
        >
          <EmailIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      <Zoom
        in={emailFailed === false}
        timeout={500}
        sx={{
          display: emailFailed === false ? "block" : "none",
          borderRadius: "20px",
        }}
      >
        <Button variant="contained" color="success">
          <MarkEmailReadIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      {/* <Zoom
        in={emailFailed}
        timeout={500}
        sx={{ display: emailFailed ? "block" : "none" }}
      >
        <Button variant="contained" color="success">
          <CancelIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom> */}
      <Typography variant="h3">Verify Email</Typography>
      <Typography variant="h6">
        Click the button to verify your email
      </Typography>
      {emailFailed === true && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}

export default ConfirmEmail;
