//This component can be used to express for loading, successful, and fail status
//it depends on props.error and props.loading
//example usage: {loading && <Progress loading={loading} error={error} />}
import React from "react";
import { Zoom } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
function Progress(props) {
  return (
    <>
      {props.loading == true && props.error == null && (
        <LoadingButton
          loading
          variant="text"
          color={props.color}
        ></LoadingButton>
      )}
      {props.error == false && (
        <Zoom
          in={!props.error}
          timeout={500}
          color={props.color == null ? "error" : props.color}
        >
          <DoneIcon />
        </Zoom>
      )}
      {props.error == true && (
        <Zoom
          in={props.error}
          timeout={500}
          color={props.color == null ? "success" : props.color}
        >
          <ErrorIcon />
        </Zoom>
      )}
    </>
  );
}

export default Progress;
