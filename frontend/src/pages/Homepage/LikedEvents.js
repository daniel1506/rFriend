import Grid from "@mui/material/Grid";
import { useState, useEffect, useContext } from "react";
import get from "../../lib/get";
import getUrl from "../../lib/getUrl";
import useSWR from "swr";
import EventCard from "../../components/EventCard";
import { Box, Container, Typography } from "@mui/material";
import GeneralContext from "../../store/general-context";

const LikedEvents = () => {
  const [likedOnes, setLikedOnes] = useState([]);
  const { eventEventModified } = useContext(GeneralContext);
  const { data: events, mutate } = useSWR(getUrl("/api/user/browse"), get);

  useEffect(() => {
    if (events) {
      setLikedOnes(events.event.filter((event) => event.isEventLiked));
    }
  }, [events]);

  // refresh data upon context notification
  useEffect(() => {
    mutate();
  }, [eventEventModified, mutate]);

  return (
    <Container sx={{ pt: 2 }}>
      <Grid container spacing={"20px"}>
        {likedOnes.length === 0 ? (
          <Box sx={{ m: "0 auto", pt: 2 }}>
            <Typography variant="body1">You don't have liked events yet</Typography>
          </Box>
        ) : (
          <>
            {likedOnes.map((event, index) => {
              return (
                <Grid key={event.id} item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <EventCard
                      eventId={event.id}
                      eventName={event.name}
                      hostId={event.ownerId}
                      eventTime={event.startsAt}
                      isJoined={event.isEventJoined}
                      isLiked={event.isEventLiked}
                      photoUrl={event.photoUrl}
                      host={event.owner}
                      eventLocation={event.location}
                      eventCategory={event.category}
                      participants={event.participants}
                      maxParticipants={event.maxParticipants}
                      eventRemark={event.remarks}
                      eventComment={event.comment}
                    />
                  </Box>
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default LikedEvents;
