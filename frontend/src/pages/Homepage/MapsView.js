import { useRef, useEffect, useState, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useSWR from "swr";
import get from "../../lib/get";
import getUrl from "../../lib/getUrl";

// -----------------------------------------------------------------------------

const EventRender = ({ event }) => (
  <>
    {Object.entries(event).map(([key, value]) => {
      return (
        <div>
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

const MapsView = () => {
  const center = useMemo(() => ({ lat: 22.41963752639907, lng: 114.20674324035645 }), []);
  const zoom = useMemo(() => 15, []);
  const [markers, setMarkers] = useState([]); // google.maps.Marker

  const { data: events } = useSWR(getUrl("/api/user/browse"), get);

  useEffect(() => {
    if (events) {
      setMarkers(
        events.event.flatMap((event) => {
          console.log(event.coordinateLat);
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
    <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={mapLoadingRender}>
      <Map center={center} zoom={zoom} style={{ height: "50%" }} markers={markers}></Map>
    </Wrapper>
  );
};

// -----------------------------------------------------------------------------

export default MapsView;
