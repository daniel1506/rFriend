import { useRef, useEffect, useState, useMemo, useContext } from "react";
import ReactDOMServer from "react-dom/server";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useSWR from "swr";
import get from "../../lib/get";
import getUrl from "../../lib/getUrl";
import { Box, Container } from "@mui/material";
import EventCard from "../../components/EventCard";
import GeneralContext from "../../store/general-context";
import "../../css/custom.css";
// -----------------------------------------------------------------------------

const EventRender = ({ event }) => (
  <>
    <h3>{event.name}</h3>
    <div>
      {new Date(event.startsAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}{" "}
    </div>
    <div>at {event.location}</div>
    <div>by {event.owner.name}</div>
  </>
);

// -----------------------------------------------------------------------------

const Marker = (options) => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    let markerOnClickListener;

    if (marker) {
      marker.setOptions(options);
      const element = <EventRender event={options.event} />;
      const content = ReactDOMServer.renderToStaticMarkup(element);
      markerOnClickListener = marker.addListener("click", () => {
        options.infoWindow.setContent(content);
        options.infoWindow.open(marker.get("map"), marker);
        options.setSelectedEventId(options.event.id);
      });
    }

    return () => {
      if (marker && markerOnClickListener) {
        window.google.maps.event.removeListener(markerOnClickListener);
      }
    };
  }, [marker, options]);

  return null;
};

// -----------------------------------------------------------------------------

const mapLoadingRender = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const Map = ({ center, zoom, style, markers, setSelectedEventId }) => {
  const ref = useRef();
  const [mapObj, setMapObj] = useState();
  const infoWindow = useMemo(() => new window.google.maps.InfoWindow(), []);

  useEffect(() => {
    setMapObj(
      new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
      })
    );
  }, []);

  return (
    <div ref={ref} id="map" style={style}>
      {markers.map((m, i) => (
        <Marker
          key={i}
          position={m.position}
          map={mapObj}
          title={m.title}
          clickable={true}
          event={m.event}
          infoWindow={infoWindow}
          setSelectedEventId={setSelectedEventId}
        />
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------

const rootContainerStyle = (theme) => ({
  paddingTop: "16px",
  height: "calc(100% - 80px)",
  display: "flex",
  gap: "16px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
});

const mapContainerStyle = (theme) => ({
  flexGrow: 1,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "30%",
  },
});

const eventCardContainerStyle = (theme) => ({
  flexShrink: 0,
  width: 345,
  margin: "0 auto",
  overflow: "scroll",
  [theme.breakpoints.down("md")]: {
    height: "70%",
  },
});

const MapsView = () => {
  const center = useMemo(() => ({ lat: 22.41963752639907, lng: 114.20674324035645 }), []);
  const zoom = useMemo(() => 15, []);
  const [markers, setMarkers] = useState([]); // google.maps.Marker
  const [selectedEvent, setSelectedEvent] = useState(null); // event obj
  const [selectedEventId, setSelectedEventId] = useState(null); // number

  const { eventEventModified } = useContext(GeneralContext);
  const { data: events, mutate } = useSWR(getUrl("/api/user/browse"), get);

  // refresh data upon context notification
  useEffect(() => {
    mutate();
  }, [eventEventModified, mutate]);

  // construct data for displaying markers
  useEffect(() => {
    let waitForGoogle;
    if (events) {
      waitForGoogle = setInterval(() => {
        if (window.google) {
          setMarkers(
            events.event.flatMap((event) => {
              if (event.coordinateLat !== null && event.coordinateLon !== null) {
                return {
                  position: new window.google.maps.LatLng(
                    parseFloat(event.coordinateLat),
                    parseFloat(event.coordinateLon)
                  ),
                  title: event.name,
                  event,
                };
              } else {
                return [];
              }
            })
          );
          clearInterval(waitForGoogle);
        }
      }, 500);
    }

    return () => {
      if (waitForGoogle) {
        clearInterval(waitForGoogle);
      }
    };
  }, [events]);

  // update selected event on id change or event data change
  useEffect(() => {
    if (events) {
      setSelectedEvent(events.event.filter((event) => event.id === selectedEventId)[0]);
    }
  }, [events, selectedEventId]);

  return (
    <Container sx={rootContainerStyle}>
      <Box sx={mapContainerStyle}>
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={mapLoadingRender}>
          <Map
            center={center}
            zoom={zoom}
            style={{ height: "100%" }}
            markers={markers}
            setSelectedEventId={setSelectedEventId}
          ></Map>
        </Wrapper>
      </Box>
      {selectedEvent && (
        <Box sx={eventCardContainerStyle} className="example">
          <EventCard
            eventId={selectedEvent.id}
            eventName={selectedEvent.name}
            hostId={selectedEvent.ownerId}
            eventTime={selectedEvent.startsAt}
            isJoined={selectedEvent.isEventJoined}
            isLiked={selectedEvent.isEventLiked}
            photoUrl={selectedEvent.photoUrl}
            host={selectedEvent.owner}
            eventLocation={selectedEvent.location}
            eventCategory={selectedEvent.category}
            participants={selectedEvent.participants}
            maxParticipants={selectedEvent.maxParticipants}
            eventRemark={selectedEvent.remarks}
          />
        </Box>
      )}
    </Container>
  );
};

// -----------------------------------------------------------------------------

export default MapsView;
