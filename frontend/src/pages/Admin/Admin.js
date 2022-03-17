import React from "react";
import { Grid, Container, Box, IconButton, Avatar } from "@mui/material";
import Navbar from "../../components/Navbar";
import List from "@mui/material/List";
import Useritem from "./Useritem";
function Admin() {
  return (
    <>
      <Navbar Admin />
      <Container>
        <List>
          <Useritem />
        </List>
      </Container>
    </>
  );
}

export default Admin;
