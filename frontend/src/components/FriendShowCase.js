import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CrossButton from "./CrossButton";
import SubmitIconButton from "./SubmitIconButton";
import deleteReq from "../lib/delete";
function FriendShowCase(props) {
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(undefined);
  const deleteFriend = () => {
    let data = { target_user_id: props.id };
    setDeleting(true);
    deleteReq("https://rfriend.herokuapp.com/api/friend", data).then(
      (result) => {
        setDeleting(false);
        if (result.status != 200) {
          setDeleteFailed(true);
        } else {
          setDeleteFailed(false);
          props.handleDeleted();
        }
      }
    );
  };
  return (
    <ListItem
      button
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
    >
      <ListItemIcon>
        <Avatar src={props.proPic} />
      </ListItemIcon>
      <ListItemText primary={props.name} secondary={"pending..."} />
    </ListItem>
  );
}

export default FriendShowCase;
