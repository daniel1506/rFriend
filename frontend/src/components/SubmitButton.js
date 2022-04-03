//This is by default a submit Button with submit icon by default. When it takes props.error, it will show the error icon and success icon depending on the value of props.error
import React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import ResultDisplay from "./ResultDisplay";
function SubmitButton(props) {
  console.log(props);
  return (
    <LoadingButton
      variant="contained"
      endIcon={
        props.error === undefined ? (
          <SendIcon />
        ) : (
          <ResultDisplay error={props.error} />
        )
      }
      type="submit"
      {...props}
    >
      {props.children}
    </LoadingButton>
  );
}

export default SubmitButton;
