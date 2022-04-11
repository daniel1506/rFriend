import { useRef, useEffect, useState, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useSWR from "swr";
import get from "../../lib/get";
import getUrl from "../../lib/getUrl";
import { Box, Container } from "@mui/material";
import EventCard from "../../components/EventCard";

// -----------------------------------------------------------------------------

const EventRender = ({ event }) => (
  <>
    {Object.entries(event).map(([key, value]) => {
      return (
        <div key={key}>
          <h2>{key}</h2>
          <p>{String(value)}</p>
        </div>
      );
    })}
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

const Map = ({ center, zoom, style, markers }) => {
  const ref = useRef();
  const [mapObj, setMapObj] = useState();
  const infoWindow = useMemo(() => new window.google.maps.InfoWindow(), []);

  useEffect(() => {
    setMapObj(new window.google.maps.Map(ref.current, { center, zoom }));
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

  const { data: events } = useSWR(getUrl("/api/user/browse"), get);

  useEffect(() => {
    if (events) {
      setMarkers(
        events.event.flatMap((event) => {
          if (event.coordinateLat !== null && event.coordinateLon !== null) {
            return {
              position: new window.google.maps.LatLng(parseFloat(event.coordinateLat), parseFloat(event.coordinateLon)),
              title: event.name,
              event,
            };
          } else {
            return [];
          }
        })
      );
    }
  }, [events]);

  return (
    <Container sx={rootContainerStyle}>
      <Box sx={mapContainerStyle}>
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={mapLoadingRender}>
          <Map center={center} zoom={zoom} style={{ height: "100%" }} markers={markers}></Map>
        </Wrapper>
      </Box>
      <Box sx={eventCardContainerStyle}>
        <EventCard
          eventId="123"
          eventName="haha"
          hostId="123"
          eventTime="123"
          isJoined={true}
          isLiked={true}
          photoUrl="https://images.unsplash.com/photo-1649533585079-14e843c0f6c4"
          host="haha"
          eventLocation="haha"
          eventCategory="dining"
          maxParticipants={5}
          eventRemark="haha"
        />
      </Box>
    </Container>
  );
};

// -----------------------------------------------------------------------------

export default MapsView;
