import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red, pink, secondary } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CommentIcon from "@mui/icons-material/Comment";
import CommentSection from "./CommentSection.js";
//import {joinEvent, likeEvent} from './EventAPI.js';
import put from "../lib/put.js";
//import Menu from '@mui/material/Menu';
//import MenuItem from '@mui/material/MenuItem';
import EventCardSettingBtn from "./EventCardSettingBtn.js";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function SwitchCardIMG(category, url) {
  if (url != null) {
    return url;
  }
  switch (category) {
    case "dining":
      return "https://media.winefolly.com/wine-tasting-dinner.jpg";
    case "leisure":
      return "https://www.china-briefing.com/news/wp-content/uploads/2018/09/China-Brefing-Chinas-New-Gaming-Regulations-What-it-Means-for-Investors.jpg";
    case "sports":
      return "https://www.beachvillas.com/travel/wp-content/uploads/2020/11/Return_of_Sports.jpg";
    case "study":
      return "https://outwittrade.com/wp-content/uploads/2020/04/study.jpg";
    case "work":
      return "https://fr8wff00-a.akamaihd.net/philippines/wp-content/uploads/2021/05/Work-From-Home-Jobs-5.png";
    case "other":
      return "http://www.bmi.bund.de/SharedDocs/bilder/DE/schmuckbilder/service/veranstaltungen/events-01.jpg?__blob=poster&v=4";
    default:
      return "other";
  }
}

export default function EventCard(props) {
  const isHost = "2074" == props.ownerId;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // function joinEventHandler() {
  //   joinEvent(props.eventId);
  // }

  // function likeEventHandler() {
  //   likeEvent(props.eventId);
  // }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="avatar" src={props.host.profileUrl}>
            {props.host.name}
          </Avatar>
        }
        action={
          //<IconButton aria-label="settings">
          // <MoreVertIcon />
          //</IconButton>
          <EventCardSettingBtn key={props.eventName} iconType={MoreVertIcon} items={["Edit Event", "Discard Event"]} />
        }
        title={props.eventName}
        subheader={props.host.name}
      />
      <CardMedia
        component="img"
        height="194"
        //image=".\assets\images\cards\category_dining.jpg"
        image={SwitchCardIMG(props.eventCategory, props.photoUrl)}
        alt="Category Image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary"></Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to calendar"
          onClick={() => {
            put("https://rfriend.herokuapp.com/api/user/join", {
              event_id: props.eventId,
            });
          }}
        >
          {props.isJoined ? (
            <EventAvailableIcon color="secondary" />
          ) : (
            <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                style={{ fill: "rgba(0, 0, 0, 0.54)" }}
                d="M224 232C237.3 232 248 242.7 248 256V304H296C309.3 304 320 314.7 320 328C320 341.3 309.3 352 296 352H248V400C248 413.3 237.3 424 224 424C210.7 424 200 413.3 200 400V352H152C138.7 352 128 341.3 128 328C128 314.7 138.7 304 152 304H200V256C200 242.7 210.7 232 224 232zM152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z"
              />
            </svg>
          )}
        </IconButton>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            put("https://rfriend.herokuapp.com/api/user/save", {
              event_id: props.eventId,
            });
          }}
        >
          {props.isLiked ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteIcon />}
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>
            <EventIcon /> {props.eventName}
          </Typography>
          <Typography>
            <CalendarMonthIcon /> {new Date(props.eventTime).toLocaleDateString()}
          </Typography>
          <Typography>
            <AccessTimeIcon /> {new Date(props.eventTime).toLocaleTimeString()}
          </Typography>
          <Typography>
            <LocationOnIcon /> {props.eventLocation}
          </Typography>
          <Typography>
            <CategoryIcon /> {props.eventCategory.charAt(0).toUpperCase() + props.eventCategory.slice(1)}
          </Typography>
          <Typography>
            <PeopleIcon /> Maximum participants: {props.maxParticipants}
          </Typography>
          <Typography paragraph>
            <EventNoteIcon /> Remark: {props.eventRemark}
          </Typography>
          <Typography>
            <CommentIcon /> Comment:{" "}
          </Typography>
          <CommentSection />
        </CardContent>
      </Collapse>
    </Card>
  );
}
