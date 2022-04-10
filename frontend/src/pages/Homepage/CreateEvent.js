//@ts-check
import React, { useCallback, useMemo, useContext } from "react";
import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Modal,
  Backdrop,
  Slide,
  Box,
  InputLabel,
  FormControl,
  Input,
  Avatar,
} from "@mui/material";
import TimePicker from "./TimePicker";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SubmitButton from "../../components/SubmitButton";
import CloseButton from "../../components/CloseButton";
import SquareToggleButton from "../../components/SquareToggleButton";
import PrivacyButtonGroup from "../../components/PrivacyButtonGroup";
import SubmitIconButton from "../../components/SubmitIconButton";
import ImageIcon from "@mui/icons-material/Image";
import post from "../../lib/post";
import put from "../../lib/put";
import { categoryPhotos } from "../../lib/sharedResource";
import CoordinateChooser from "../../components/CoordinateChooser";
import GeneralContext from "../../store/general-context";
import AuthContext from "../../store/auth-context";
const style = {
  //control the style of the modal container
  position: "absolute",
  left: "0",
  right: "0",
  marginLeft: "auto",
  marginRight: "auto",
  top: "50%",
  bottom: "50%",
  transform: "translateX(0%) translateY(-50%) !important",
  height: "min-content",
  marginBottom: "auto",
  "@media (min-width: 0px)": {},
  "@media (min-width: 600px)": {
    width: "400px",
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
  const handleClose = () => {
    props.setShowCreateEvent(false);
    generalCtx.handleSelectEvent(null);
  };
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [category, setCategory] = useState("");
  const [notification, setNotification] = useState(false);
  const [quota, setQuota] = useState(1);
  const [eventPic, setEventPic] = useState("");
  const [eventPicFailed, setEventPicFailed] = useState(undefined);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("friend");
  const [remarks, setRemarks] = useState("");
  const [creating, setCreating] = useState(false);
  const [createFailed, setCreateFailed] = useState(undefined);
  const [coordinate, setCoordinate] = useState({ lat: null, lng: null });
  const generalCtx = useContext(GeneralContext);
  const validateTitle = (title) => {};

  const handleChangePrivacy = (event, newPrivacy) => {
    console.log(newPrivacy);
    setPrivacy(newPrivacy);
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
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

  const saveImage = async (e) => {
    try {
      const file = e.target.files[0];
      const eventPic = await convertBase64(file);
      console.log(eventPic);
      setEventPicFailed(!eventPic.startsWith("data:image"));
      setEventPic(eventPic);
    } catch (err) {
      setEventPicFailed(true);
      console.log(err);
    }
  };

  const createEvent = () => {
    let duration = endTime - startTime;
    let data = {
      name: title,
      category: category,
      time: startTime,
      duration: duration,
      location: location,
      max_participants: quota,
      privacy: privacy,
      remarks: remarks,
      ...(eventPic !== "" && { photo: eventPic }),
      ...(coordinate.lat !== null && { coordinate_lat: coordinate.lat }),
      ...(coordinate.lng !== null && { coordinate_lon: coordinate.lng }),
    };
    console.log(data);
    setCreating(true);
    post("https://rfriend.herokuapp.com/api/event", data).then((result) => {
      setCreating(false);
      if (result.status != 201) {
        setCreateFailed(true);
      } else {
        setCreateFailed(false);
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    });
  };
  const updateEvent = () => {
    let duration = endTime - startTime;
    let data = {
      id: parseInt(generalCtx.eventIdSelected),
      name: title,
      category: category,
      time: startTime,
      duration: duration,
      location: location,
      max_participants: quota,
      photo: eventPic,
      privacy: privacy,
      remarks: remarks,
      ...(eventPic !== "" && { photo: eventPic }),
      ...(coordinate.lat !== null && { coordinate_lat: coordinate.lat }),
      ...(coordinate.lng !== null && { coordinate_lon: coordinate.lng }),
    };
    console.log("updating...");
    console.log(data);
    setCreating(true);
    put("https://rfriend.herokuapp.com/api/event", data).then((result) => {
      setCreating(false);
      if (result.status != 201) {
        setCreateFailed(true);
      } else {
        setCreateFailed(false);
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    });
  };

  const displayCustomEventPicIfAvailable = useMemo(() => {
    if (eventPic === "") {
      return categoryPhotos[category];
    }

    return eventPic;
  }, [eventPic, category]);
  console.log(generalCtx.eventIdSelected);
  console.log(generalCtx.eventIdSelected !== null);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.showCreateEvent || generalCtx.eventIdSelected !== null}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ overflow: "scroll" }}
    >
      <Slide in={props.showCreateEvent || generalCtx.eventIdSelected !== null}>
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
            <Avatar
              variant="square"
              src={displayCustomEventPicIfAvailable}
              style={{ width: "100%", height: "150px" }}
              sx={{ borderRadius: 3 }}
            >
              <ImageIcon />
            </Avatar>
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
                  validateTitle(e.target.value);
                  setTitle(e.target.value);
                }}
              />
              <TextField
                type="text"
                label="location"
                onChange={(e) => {
                  setLocation(e.target.value);
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
              <TextField
                label="quota"
                type="number"
                value={quota}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (parseInt(e.target.value) > 0) setQuota(parseInt(e.target.value));
                }}
              />
              <TextField
                label="remark"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  setRemarks(e.target.value);
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
                <Select labelId="Category" value={category} onChange={handleChangeCategory} label="Category">
                  <MenuItem value={"dining"}>dining</MenuItem>
                  <MenuItem value={"sports"}>sports</MenuItem>
                  <MenuItem value={"study"}>study</MenuItem>
                  <MenuItem value={"work"}>work</MenuItem>
                  <MenuItem value={"leisure"}>leisure</MenuItem>
                  <MenuItem value={"others"}>others</MenuItem>
                </Select>
              </FormControl>

              {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="Privacy">Privacy*</InputLabel>
                <Select
                  labelId="Privacy"
                  value={privacy}
                  onChange={(e) => {
                    setPrivacy(e.target.value);
                  }}
                  label="Privacy"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl> */}
              <PrivacyButtonGroup value={privacy} onChange={handleChangePrivacy} />
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
              <TimePicker label="Start time" setTime={setStartTime} />
              <SquareToggleButton
                selected={notification}
                onChange={() => {
                  setNotification((prev) => !prev);
                }}
                color="primary"
              >
                <NotificationsIcon />
              </SquareToggleButton>
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
              <TimePicker label="End time" setTime={setEndTime} />
              <label htmlFor="icon-button-file">
                <Input
                  inputProps={{ accept: "image/*" }}
                  id="icon-button-file"
                  type="file"
                  sx={{ display: "none" }}
                  onChange={(e) => {
                    saveImage(e);
                  }}
                />
                {/* <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ width: 54, height: 54 }}
                >
                  <PhotoCamera />
                </IconButton> */}
                <SubmitIconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ width: 54, height: 54 }}
                  loading={false}
                  error={eventPicFailed}
                >
                  <PhotoCamera />
                </SubmitIconButton>
              </label>
            </Box>
            <Box sx={{ height: 250 }}>
              <CoordinateChooser setChosenCoord={setCoordinate} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: "space-around",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CloseButton onClick={handleClose} sx={{ flexGrow: 0 }}>
                Cancel
              </CloseButton>
              <SubmitButton
                loading={creating}
                error={createFailed}
                onClick={generalCtx.eventIdSelected === null ? createEvent : updateEvent}
              >
                Submit
              </SubmitButton>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
}

export default CreateEvent;
