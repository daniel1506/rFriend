import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from '@mui/material/Paper';
import { MessageLeft, MessageRight, TextInput } from "./Comment.js";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      //position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "start"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )"
    }
  })
);

export default function CommentSection() {
  const classes = useStyles();
  return (
    <>
    <MessageLeft
            message="ABCD"
            timestamp="MM/DD 00:00"
            photoURL=""
            displayName="User A"
            avatarDisp={true}
          />
          <MessageLeft
            message="ABCD"
            timestamp="MM/DD 00:00"
            photoURL=""
            displayName="User B"
            avatarDisp={false}
          />
          <MessageRight
            message="EFCG"
            timestamp="MM/DD 00:00"
            photoURL=""
            displayName="User C"
            avatarDisp={true}
          />
          <MessageRight
            message="ABCE"
            timestamp="MM/DD 00:00"
            photoURL=""
            displayName="User C"
            avatarDisp={false}
          />
          <TextInput />
    </>
  );
}
