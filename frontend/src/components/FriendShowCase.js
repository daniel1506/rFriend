import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import CrossButton from "./CrossButton";
function FriendShowCase(props) {
  return (
    <ListItem button onClick={props.onClick}>
      <ListItemIcon>
        <Avatar src={props.proPic} />
      </ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItem>
  );
}

export default FriendShowCase;
