//@ts-check
import "./App.css";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import logo from "./static/img/logo.svg";
import {
  Typography,
  Button,
  ButtonGroup,
  Modal,
  Box,
  Slide,
  Zoom,
  Fade,
  Grow,
} from "@mui/material";
import Logreg from "./Logreg.jsx";
const styles = (theme) => ({
  cssLabel: {
    color: "green",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },

  cssFocused: {},

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "green !important",
  },
});
function Auth() {
  return (
    <div className="App">
      <header className="App-header">
        <Zoom in={true} timeout={1000}>
          <div>
            <img src={logo} className="App-logo" style={{ width: 300 }} />
          </div>
        </Zoom>
        <Fade in={true} timeout={1000}>
          <div>
            <Typography variant="h1">rFriend</Typography>
            <Typography variant="h5">Save your event</Typography>
          </div>
        </Fade>
        <Logreg />
      </header>
    </div>
  );
}

export default Auth;
