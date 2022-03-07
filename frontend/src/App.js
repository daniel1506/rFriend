//@ts-check
import "./App.css";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Typography,
  Button,
  ButtonGroup,
  Modal,
  Box,
  Slide,
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
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GroupAddIcon className="App-logo" style={{ fontSize: "200px" }} />
        <Typography variant="h1">rFriend</Typography>
        <Typography variant="h5">Save your event</Typography>
        <Logreg />
      </header>
    </div>
  );
}

export default App;
