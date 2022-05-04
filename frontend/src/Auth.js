//@ts-check
import "./App.css";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import logo from "./static/img/logo.svg";
import { Typography, Button, ButtonGroup, Modal, Box, Slide, Zoom, Fade, Grow } from "@mui/material";
import Logreg from "./Logreg.jsx";
import { Container } from "@material-ui/core";
import VerticalFlex from "./layout/VerticalFlex";
function Auth() {
  return (
    <Box display="flex" minHeight={"100vh"} flexDirection="column" alignItems="center" justifyContent="center">
      <Zoom in={true} timeout={1000}>
        <Box>
          <img src={logo} className="App-logo" style={{ width: 300 }} />
        </Box>
      </Zoom>
      <Fade in={true} timeout={1000}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h1">rFriend</Typography>
          <Typography variant="h5">Save your event</Typography>
        </div>
      </Fade>
      <Logreg />
    </Box>
  );
}

export default Auth;
