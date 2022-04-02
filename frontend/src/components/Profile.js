import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import testlogo from "../static/img/nbuna.jpg";
import VerticalFlex from "../layout/VerticalFlex";
import NameInput from "./NameInput";
import PasswordInput from "./PasswordInput";
import CfPasswordInput from "./CfPasswordInput";
import EmailShowCase from "./EmailShowCase.js";
import NameShowCase from "./NameShowCase";
import SubmitButton from "./SubmitButton";
import CloseButton from "./CloseButton";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { IconButton, CircularProgress } from "@mui/material";
import Input from "@mui/material/Input";
import AuthContext from "../store/auth-context";
import post from "../lib/post";
import put from "../lib/put";
import get from "../lib/get";
import LoadingIcon from "./LoadingIcon";
import CrossButton from "./CrossButton";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ErrorIcon from "@mui/icons-material/Error";
import LockResetIcon from "@mui/icons-material/LockReset";
const style = {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  left: "0",
  right: "0",
  marginLeft: "auto",
  marginRight: "auto",
  top: "50%",
  bottom: "50%",
  marginBottom: "auto",
  height: "600px",
  marginTop: "-300px",
  //The below style in the media query will replace some style above when the screen is large enough
  "@media (min-width: 700px)": {
    width: "30%",
    height: "600px",
    marginTop: "-300px",
  },
  "@media (min-width: 1400px)": {
    width: "30%",
    height: "400px",
    marginTop: "-200px",
  },

  // "@media (max-width: 1025px)": {
  //   height: "700px",
  //   marginTop: "-350px",
  // },
  // "@media (min-width: 1026px)": {
  //   height: "500px",
  //   marginTop: "-250px",
  // },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

export default function Profile(props) {
  const authCtx = React.useContext(AuthContext);
  const handleOpen = () => props.setShowProfile(true);
  const handleClose = () => props.setShowProfile(false);
  const [profilePicUrl, setProfilePicUrl] = React.useState(null);
  const [submittingProPic, setSubmittingProPic] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [resetFailed, setResetFailed] = React.useState(undefined);
  const [email, setEmail] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [uploading, setUpLoading] = React.useState(false);
  const getUserProfile = () => {
    let id = props.id ? props.id : authCtx.id;
    setUpLoading(true);
    get(
      `https://rfriend.herokuapp.com/api/user?user_id=${encodeURIComponent(id)}`
    )
      .then((result) => {
        console.log(result);
        setProfilePicUrl(result.profile_url);
        setEmail(result.email);
        setUserName(result.name);
        setUpLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    getUserProfile();
  }, [props.id]);
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const profile = await convertBase64(file);
    console.log(profile);
    const data = { profile };
    setSubmittingProPic(true);
    console.log(data);
    put("https://rfriend.herokuapp.com/api/user/profile", data)
      .then((result) => {
        setSubmittingProPic(false);
        console.log(result.status);
        console.log(result.profile_url);
        setProfilePicUrl(result.profile_url);
      })
      .catch((err) => {
        setSubmittingProPic(false);
        console.log(err);
      });
  };
  const resetPassword = () => {
    let data = { email: authCtx.email };
    setResetting(true);
    post("https://rfriend.herokuapp.com/api/user/forget_pw", data).then(
      (result) => {
        setResetting(false);
        if (result.status != 200) {
          setResetFailed(true);
        } else {
          setResetFailed(false);
        }
      }
    );
  };
  const redirectToMailBox = () => {
    let email = authCtx.email;
    let emailDomain = email.split("@")[1];
    window.open(`http://${emailDomain}`, "_blank");
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.showProfile}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Slide in={props.showProfile}>
          <Box sx={style}>
            <CrossButton handleClose={handleClose} color="secondary" />
            {uploading && <CircularProgress />}
            {!uploading && (
              <>
                <Grid
                  container
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent={{ xs: "space-around" }}
                  alignItems={{ xs: "center" }}
                  sx={{ height: "100%" }}
                >
                  <Grid item>
                    <VerticalFlex gap="10px">
                      <Badge
                        badgeContent={
                          <label htmlFor="icon-button-file">
                            <Input
                              inputProps={{ accept: "image/*" }}
                              id="icon-button-file"
                              type="file"
                              sx={{ display: "none" }}
                              onChange={(e) => {
                                uploadImage(e);
                              }}
                              disabled={submittingProPic}
                            />
                            <IconButton
                              aria-label="delete"
                              color="primary"
                              component="span"
                              disabled={submittingProPic}
                              sx={{ display: props.id ? "none" : "block" }}
                            >
                              {!submittingProPic && <EditIcon />}
                              {submittingProPic && <LoadingIcon />}
                            </IconButton>
                          </label>
                        }
                        overlap="circular"
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      >
                        <Avatar
                          alt="Cindy Baker"
                          src={profilePicUrl}
                          sx={{ width: 200, height: 200 }}
                        />
                      </Badge>
                      <NameShowCase>{username}</NameShowCase>
                      <EmailShowCase>{email}</EmailShowCase>
                      {!removing && (
                        <IconButton
                          color="error"
                          sx={{
                            display:
                              props.id && !props.admin ? "block" : "none",
                          }}
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      )}
                      {resetFailed !== false && (
                        <SubmitButton
                          variant="contained"
                          color="warning"
                          sx={{
                            display: !props.id ? "flex" : "none",
                          }}
                          endIcon={<LockResetIcon />}
                          error={resetFailed}
                          loading={resetting}
                          onClick={() => {
                            resetPassword();
                          }}
                        >
                          Reset Password
                        </SubmitButton>
                      )}
                      {resetFailed === false && (
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => {
                            redirectToMailBox();
                            authCtx.logout();
                          }}
                        >
                          Check Your email
                        </Button>
                      )}
                    </VerticalFlex>
                  </Grid>

                  {/* {!props.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitNewPassword();
                      }}
                    >
                      <VerticalFlex>
                        <PasswordInput
                          label="new password"
                          setPassword={setPassword}
                        />
                        <CfPasswordInput password={password} />
                        <SubmitButton uploading={submittingNewPassword}>
                          Submit
                        </SubmitButton>
                        <CloseButton onClick={handleClose}>Close</CloseButton>
                      </VerticalFlex>
                    </form>
                  )} */}
                </Grid>
              </>
            )}
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
