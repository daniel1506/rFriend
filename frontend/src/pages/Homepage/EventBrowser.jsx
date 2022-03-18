import React from "react";
import ReactDOM from "react-dom";
import "./EventBrowser.css";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

class EventBrowser extends React.Component {
  render() {
    return (
      <>
        <EventSearchBar />
        <EventFilter />
      </>
    );
  }
}

class EventSearchBar extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 .col-event-search-bar">
              <div className="input-group event-search-bar shadow-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text search-input-group-text">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                </div>
                <input
                  className="form-control search-input"
                  style={{ borderRadius: "0px 20px 20px 0px" }}
                  type="text"
                />
                <div className="input-group-append"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class EventFilter extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xl-3 col-filter">
              <div className="div-filter">
                <h3>Event Filter</h3>
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle dropdown-filter"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Event Catagory
                  </button>
                  <div className="dropdown-menu" role="menu">
                    <a className="dropdown-item" role="presentation" href="#">
                      First Item
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Second Item
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Third Item
                    </a>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle dropdown-filter"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Time
                  </button>
                  <div className="dropdown-menu" role="menu">
                    <a className="dropdown-item" role="presentation" href="#">
                      Morning
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Afternoon
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Evening
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Night
                    </a>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle dropdown-filter"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Location
                  </button>
                  <div className="dropdown-menu" role="menu">
                    <a className="dropdown-item" role="presentation" href="#">
                      Hong Kong Island
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Kowloon
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      New Territory
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Online
                    </a>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle dropdown-filter"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    Friend's Event
                  </button>
                  <div className="dropdown-menu" role="menu">
                    <a className="dropdown-item" role="presentation" href="#">
                      Friends only
                    </a>
                    <a className="dropdown-item" role="presentation" href="#">
                      Friends of friends
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <EventCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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

export default function EventCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="host_avatar">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Event Name"
        subheader="Date"
      />
      <CardMedia
        component="img"
        height="194"
        image="src\images\cards\event.png"
        alt="Event Name"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Event Location:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Event Description:
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Event Tags</Typography>
          <Typography paragraph>Event Comments</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

ReactDOM.render(<EventBrowser />, document.querySelector("#eventBrowser"));
