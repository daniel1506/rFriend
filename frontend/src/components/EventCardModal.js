import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EventCard from "./EventCard.js";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import get from '../lib/get';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EventCardModal(props) {
  const [open, setOpen] = React.useState(false);
  const [eventInfo, setEventInfo] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/user/browse").then((r) => {
      setEventInfo(
        r.event.filter((event) => {
          if (event.id == props.appointmentData.id) {
            return true;
          } else {
            return false;
          }
        })
      );
    });
  }, []);

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {eventInfo?<EventCard
          eventId={eventInfo.id}
          eventName={eventInfo.name}
          hostId={eventInfo.ownerId}
          eventTime={eventInfo.startsAt}
          isJoined={eventInfo.isEventJoined}
          isLiked={eventInfo.isEventLiked}
          photoUrl={eventInfo.photoUrl}
          host={eventInfo.owner}
          eventLocation={eventInfo.location}
          eventCategory={eventInfo.category}
          participants={eventInfo.participants}
          maxParticipants={eventInfo.maxParticipants}
          eventRemark={eventInfo.remarks}
          eventComment={eventInfo.comments}
        />:<></>}
      </Modal>
    </div>
  );
}
