import { useRef, useEffect, useState, useMemo } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import useSWR from "swr";
import get from "../../lib/get";
import getUrl from "../../lib/getUrl";

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
    if (marker) {
      marker.setOptions(options);
    }
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

  useEffect(() => {
    setMapObj(new window.google.maps.Map(ref.current, { center, zoom }));
  }, []);

  return (
    <div ref={ref} id="map" style={style}>
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} map={mapObj} title={m.title} clickable={true} />
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
        events.event.map((event) => ({
          position: new window.google.maps.LatLng(parseFloat(event.coordinateLat), parseFloat(event.coordinateLon)),
          title: event.name,
        }))
      );
    }
    console.log(events);
  }, [events]);

  return (
    <Wrapper apiKey="AIzaSyDlJrKgXe1HXYhS6wNei1Ld-u0ox4dHdzY" render={mapLoadingRender}>
      <Map center={center} zoom={zoom} style={{ height: "50%" }} markers={markers}></Map>
    </Wrapper>
  );
};

// -----------------------------------------------------------------------------

export default MapsView;
