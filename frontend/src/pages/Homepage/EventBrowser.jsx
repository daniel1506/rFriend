import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./EventBrowser.css";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
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
import SearchIcon from "@mui/icons-material/Search";
import EventCard from "../../components/EventCard.js";
//import Events from './assets/Events.js';
//import GetEvents from './EventAPI.js';
import get from "../../lib/get.js";
import { StaticDatePicker } from "@mui/lab";

//var eventList = GetEvents('https://rfrconsole.log(r.event)iend.herokuapp.com/api/user/browse').then((r)=>{});
//console.log(GetEvents('https://rfriend.herokuapp.com/api/user/browse'));
//var filteredEvents = Events;

export default function EventBrowser() {
  const [searchKey, setSearchKey] = React.useState("");
  const [eventList, setEventList] = React.useState([]);
  const [filteredEvents, setFilteredEvents] = React.useState(Events);

  const sendSearchKey = (key) => {
    // the callback. Use a better name
    setSearchKey(key);
  };
  const sendFilteredEvents = (events) => {
    // the callback. Use a better name
    setFilteredEvents(events);
  };

  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/user/browse").then((r) => {
      setEventList(r.event);
    });
  }, []);
  //useEffect(() => {eventSearchHandler()}, [searchKey]);

  return (
    <>
      <EventSearchBar sendSearchKey={sendSearchKey} />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xl-3 col-filter">
              <EventFilter eventList={eventList} sendFilteredEvents={sendFilteredEvents} />
            </div>
            <div className="col-md-6 event-card-deck">
              <EventCardDeck eventList={eventList} filteredEvents={filteredEvents} searchKey={searchKey} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventSearchBar({ sendSearchKey }) {
  const [searchKey, setSearchKey] = React.useState("");

  const handleSearchFieldOnChange = (event) => {
    setSearchKey(event.target.value);
  };

  useEffect(() => {
    sendSearchKey(searchKey);
  }, [searchKey]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 .col-event-search-bar">
            <div className="input-group event-search-bar shadow-sm">
              <TextField
                placeholder="Search"
                type="search"
                variant="standard"
                fullWidth
                size="small"
                value={searchKey}
                onChange={handleSearchFieldOnChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventFilter({ eventList, sendFilteredEvents }) {
  const [filterCategory, setCategory] = React.useState("");
  const [filterTime, setTime] = React.useState("");
  const [filterLocation, setLocation] = React.useState("");
  const [filterPrivacy, setPrivacy] = React.useState("");
  var filteredEvents = eventList;

  // const handleCategoryChange = (event: SelectChangeEvent) => {
  //   setCategory(event.target.value);
  // };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };
  useEffect(() => {
    eventFilterHandler();
  }, [filterCategory, filterTime, filterPrivacy, eventList]);

  function eventFilterHandler() {
    filteredEvents = eventList.filter((event) => {
      //console.log(event.startsAt);
      //console.log(new Date(event.startsAt));
      if (filterCategory != null && filterCategory != "") {
        if (event.category.toLowerCase() != filterCategory) {
          return false;
        }
      }
      if (filterTime != null && filterTime != "") {
        let time = new Date(event.startsAt);
        if (time.getHours() >= 6 && time.getHours() < 12 && filterTime != "morning") return false;
        else if (time.getHours() >= 12 && time.getHours() < 18 && filterTime != "afternoon") return false;
        else if (time.getHours() >= 18 && time.getHours() < 21 && filterTime != "evening") return false;
        else if (time.getHours() >= 21 && time.getHours() < 24 && filterTime != "night") return false;
        else if (time.getHours() >= 0 && time.getHours() < 6 && filterTime != "midnight") return false;
      }
      if (filterPrivacy != null && filterPrivacy != "") {
        if (event.privacy != filterPrivacy) {
          return false;
        }
      }
      return true;
    });
    //console.log(filteredEvents);
    sendFilteredEvents(filteredEvents);
  }

  return (
    <div className="div-filter shadow">
      <h3>Event Filter</h3>
      <div>
        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel id="filter-event-category-label">Event Category</InputLabel>
          <Select
            labelId="filter-event-category-label"
            id="filter-event-category"
            value={filterCategory}
            label="Event Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="dining">Dining</MenuItem>
            <MenuItem value="leisure">Leisure</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="study">Study</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel id="filter-event-time-label">Event Time</InputLabel>
          <Select
            labelId="filter-event-time-label"
            id="filter-event-time"
            value={filterTime}
            label="Event Time"
            onChange={handleTimeChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="morning">Morning</MenuItem>
            <MenuItem value="afternoon">Afternoon</MenuItem>
            <MenuItem value="evening">Evening</MenuItem>
            <MenuItem value="night">Night</MenuItem>
            <MenuItem value="midnight">Midnight</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel id="filter-event-location-label">Event Location</InputLabel>
          <Select
            labelId="filter-event-location-label"
            id="filter-event-location"
            value={filterLocation}
            label="Event Location"
            onChange={handleLocationChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="hkisland">Hong Kong Island</MenuItem>
            <MenuItem value="kowloon">Kowloon</MenuItem>
            <MenuItem value="nt">New Territory</MenuItem>
            <MenuItem value="online">Online</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel id="filter-event-privacy-label">Event Privacy</InputLabel>
          <Select
            labelId="filter-event-privacy-label"
            id="filter-event-privacy"
            value={filterPrivacy}
            label="Event Privacy"
            onChange={handlePrivacyChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="friends">Friends</MenuItem>
            <MenuItem value="friends-of-friends">Friends of Friends</MenuItem>
            <MenuItem value="only-me">Private</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

function EventCardDeck(props) {
  const [filteredEventList, setFilteredEventList] = React.useState([]);
  const [displayedEventList, setDisplayedEventList] = React.useState([]);
  useEffect(() => {
    setFilteredEventList(props.filteredEvents);
    setDisplayedEventList(props.filteredEvents);
  }, [props.filteredEvents]);
  useEffect(() => {
    eventFilterHandler();
  }, [props.searchKey]);
  function eventFilterHandler() {
    if (props.searchKey != null && props.searchKey != "") {
      setDisplayedEventList(
        filteredEventList.filter((event) => {
          return event.name.toLowerCase().includes(props.searchKey.toLowerCase());
        })
      );
    }
    if (props.searchKey == null || props.searchKey == "") {
      setDisplayedEventList(filteredEventList);
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {displayedEventList.map((e, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <EventCard
                eventId={e.id}
                eventName={e.name}
                hostId={e.ownerId}
                eventTime={e.startsAt}
                isJoined={e.isEventJoined}
                isLiked={e.isEventLiked}
                photoUrl={e.photoUrl}
                host={e.owner}
                eventLocation={e.location}
                eventCategory={e.category}
                maxParticipants={e.maxParticipants}
                eventRemark={e.remarks}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

ReactDOM.render(<EventBrowser />, document.querySelector("#eventBrowser"));
