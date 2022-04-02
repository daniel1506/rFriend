import React from "react";
import { ListItem, ListItemIcon, ListItemText, Avatar } from "@mui/material";
function FriendShowCase(props) {
  return (
    <ListItem>
      <ListItemIcon>
        <Avatar src={props.proPic} />
      </ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItem>
  );
}

export default FriendShowCase;
