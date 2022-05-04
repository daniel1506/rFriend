import React, { useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Calendar from "./Calendar.js";
import get from "../../lib/get";
import GeneralContext from "../../store/general-context.js";
import { Container } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [eventList, setEventList] = React.useState([]);
  const generalCtx = useContext(GeneralContext);
  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/user/browse").then((r) => {
      setEventList(
        r.event.filter((event) => {
          if (event.isEventLiked) {
            return true;
          } else {
            return false;
          }
        })
      );
    });
  }, [generalCtx.eventEventModified]);

  return (
    <Container sx={{ pt: 2 }}>
      <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} sm={12} md={10}>
          <Calendar />
        </Grid>
      </Grid>
    </Container>
  );
}
//-----------------------------------------------
const rootContainerStyle = (theme) => ({
  paddingTop: "16px",
  height: "calc(100% - 80px)",
  display: "flex",
  gap: "16px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
});
const mapContainerStyle = (theme) => ({
  flexGrow: 1,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "30%",
  },
});
