import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import testlogo from "../static/img/logo512.png";
import VerticalFlex from "../layout/VerticalFlex";
import NameInput from "./NameInput";
import PasswordInput from "./PasswordInput";
import CfPasswordInput from "./CfPasswordInput";
import EmailShowCase from "./EmailShowCase.js";
import NameShowCase from "./NameShowCase";
const style = {
  position: "absolute",
  left: "0",
  right: "0",
  marginLeft: "auto",
  marginRight: "auto",
  top: "50%",
  bottom: "50%",
  marginTop: "-250px",
  marginBottom: "auto",
  width: "40%",
  height: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

export default function Profile(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [password, setPassword] = React.useState(null);
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Slide in={open}>
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
                  <Avatar
                    alt="Cindy Baker"
                    src={testlogo}
                    sx={{ width: 200, height: 200 }}
                  />
                  <NameShowCase>owo</NameShowCase>
                  <EmailShowCase>owo@example.com</EmailShowCase>
                </VerticalFlex>
              </Grid>

              <form>
                <VerticalFlex>
                  <NameInput label="new username" />
                  <PasswordInput
                    label="new password"
                    setPassword={setPassword}
                  />
                  <CfPasswordInput password={password} />
                </VerticalFlex>
              </form>
            </Grid>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
