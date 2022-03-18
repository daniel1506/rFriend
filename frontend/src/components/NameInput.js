import { React, useState } from "react";
import TextField from "@mui/material/TextField";
function NameInput(props) {
  return (
    <TextField
      label={props.label ? props.label : "username"}
      className="info-input"
      onChange={(e) => {
        props.setUsername(e.target.value);
      }}
    />
  );
}

export default NameInput;
