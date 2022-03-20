//This component can be used to express for loading, successful, and fail status
//it depends on props.error and props.loading
import React from "react";
import { Zoom } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
function Progress(props) {
  return (
    <>
      {props.loading == true && props.error == null && (
        <LoadingButton loading variant="outlined">
          owo
        </LoadingButton>
      )}
      {props.error == false && (
        <Zoom in={!props.error} timeout={500}>
          <DoneIcon />
        </Zoom>
      )}
      {props.error == true && (
        <Zoom in={props.error} timeout={500}>
          <ErrorIcon />
        </Zoom>
      )}
    </>
  );
}

export default Progress;
