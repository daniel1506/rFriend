import { React, useState } from "react";
import VerticalFlex from "../../layout/VerticalFlex";
import {
  TextField,
  Checkbox,
  Select,
  MenuItem,
  Modal,
  Backdrop,
  Slide,
  Grid,
  Box,
  InputLabel,
  FormControl,
  TextareaAutosize,
  ToggleButton,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticTimePicker from "@mui/lab/StaticTimePicker";
import TimePicker from "./TimePicker";
import HorizontalFlex from "../../layout/HorizontalFlex";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SubmitButton from "../../components/SubmitButton";
import CloseButton from "../../components/CloseButton";
const style = {
  //control the style of the modal container
  position: "absolute",
  left: "0",
  right: "0",
  marginLeft: "auto",
  marginRight: "auto",
  top: "50%",
  bottom: "50%",
  marginBottom: "auto",
  marginTop: "-160px",
  "@media (min-width: 0px)": {
    marginTop: "-240px",
    height: "480px",
  },
  "@media (min-width: 600px)": {
    width: "400px",
    height: "290px",
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
function CreateEvent(props) {
  const handleClose = () => props.setShowCreateEvent(false);
  const [title, setTitle] = useState(null);
  const [titleError, setTitleError] = useState(false);
  const [category, setCategory] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [notification, setNotification] = useState(false);
  const validateTitle = (title) => {};
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.showCreateEvent}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Slide in={props.showCreateEvent}>
        <Box sx={style}>
          <Box
            sx={{
              display: { xs: "flex" },
              flexDirection: { xs: "column" },
              aligenItems: "center",
              justifyContent: "space-around",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                aligenItems: "center",
                justifyContent: "space-around",
                gap: 1,
              }}
            >
              <TextField
                error={titleError}
                helperText={titleError ? "Must fill in" : ""}
                type="text"
                label="title*"
                onChange={(e) => {
                  props.setTitle(e.target.value);
                  validateTitle(e.target.value);
                }}
              />
              <TextField
                type="text"
                label="location"
                onChange={(e) => {
                  props.setLocation(e.target.value);
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                aligenItems: "center",
                justifyContent: "space-around",
                gap: 1,
              }}
            >
              <TextField label="quota" type="number" />
              <TextField
                label="remark"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row" },
                aligenItems: "center",
                justifyContent: "space-around",
                gap: 1,
              }}
            >
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="Category">Category</InputLabel>
                <Select
                  labelId="Category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  label="Category"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="Privacy">Privacy*</InputLabel>
                <Select
                  labelId="Privacy"
                  value={privacy}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  label="Privacy"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row" },
                justifyContent: "space-around",
                aligenItems: "center",
                gap: 1,
              }}
            >
              <TimePicker />
              <ToggleButton
                value="check"
                selected={notification}
                onChange={() => {
                  setNotification((prev) => !prev);
                }}
                color="primary"
              >
                <NotificationsIcon />
              </ToggleButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-around",
                aligenItems: "center",
                gap: 1,
              }}
            >
              <CloseButton onClick={handleClose}>Cancel</CloseButton>
              <SubmitButton>Submit</SubmitButton>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
}

export default CreateEvent;
