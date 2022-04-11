import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { styled } from "@mui/material/styles";
import EventCard from "../../components/EventCard.js";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Calendar from "./Calendar.js";
import get from "../../lib/get";
import GeneralContext from "../../store/general-context.js";
import { Container } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [eventList, setEventList] = React.useState([]);
  const generalCtx = useContext(GeneralContext);
  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/user/browse").then((r) => {
      setEventList(
        r.event.filter((event) => {
          if (event.isEventLiked) {
            return true;
          } else {
            return false;
          }
        })
      );
    });
  }, [generalCtx.eventEventModified]);

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
          <Grid item xs={8}>
            <Calendar />
          </Grid>
          <Grid item xs={4}>
            {eventList.map((e, index) => {
              return (
                <EventCard
                  key={e.id}
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
              );
            })}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
