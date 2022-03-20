import React from "react";
import Zoom from "@mui/material";
import { LoadingButton } from "@mui/lab";
function Progress(props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {props.loading && (
        <LoadingButton loading variant="outlined"></LoadingButton>
      )}
      {(!props.loading && loaded && !props.error)(
        <Zoom in={loaded && !props.loading} timeout={500}></Zoom>
      )}
      {props.error && <Zoom in={loaded && !props.loading} timeout={500}></Zoom>}
    </>
  );
}

export default Progress;
