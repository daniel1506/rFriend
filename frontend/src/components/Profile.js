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
import { IconButton } from "@mui/material";
import Input from "@mui/material/Input";
import AuthContext from "../store/auth-context";
import post from "../lib/post";
import put from "../lib/put";
import get from "../lib/get";
import LoadingIcon from "./LoadingIcon";
const style = {
  position: "absolute",
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
  const [password, setPassword] = React.useState(null);
  const [profilePicUrl, setProfilePicUrl] = React.useState(null);
  const [submittingProPic, setSubmittingProPic] = React.useState(false);
  const [submittingNewPassword, setSubmittingNewPassword] =
    React.useState(false);
  const getProfilePic = () => {
    let id = authCtx("id");
    get(
      `https://rfriend.herokuapp.com/api/user?user_id=${encodeURIComponent(id)}`
    );
  };
  const submitNewPassword = () => {
    setSubmittingNewPassword(true);
    const data = { password };
    post(`https://rfriend.herokuapp.com/api/user/pw_reset`, data)
      .then((result) => {
        setSubmittingNewPassword(false);
      })
      .catch((error) => {
        setSubmittingNewPassword(false);
        console.log(error);
      });
  };
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    console.log(base64);
    const data = { base64 };
    setSubmittingProPic(true);
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
            <Grid
              container
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "space-around" }}
              alignItems={{ xs: "center" }}
              sx={{ height: "100%" }}
            >
              <Grid item>
                <VerticalFlex>
                  <Badge
                    badgeContent={
                      <label htmlFor="icon-button-file">
                        <Input
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          sx={{ display: "none" }}
                          onChange={(e) => {
                            uploadImage(e);
                          }}
                        />
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          component="span"
                          disabled={submittingProPic}
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
                  <NameShowCase>{authCtx.name}</NameShowCase>
                  <EmailShowCase>{authCtx.email}</EmailShowCase>
                </VerticalFlex>
              </Grid>

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
                  <SubmitButton loading={submittingNewPassword}>
                    Submit
                  </SubmitButton>
                  <CloseButton onClick={handleClose}>Close</CloseButton>
                </VerticalFlex>
              </form>
            </Grid>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
