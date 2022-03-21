//@ts-check
import { React, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import { Grid, Container, Box, IconButton, Avatar } from "@mui/material";
import Navbar from "../../components/Navbar";
import List from "@mui/material/List";
import Useritem from "./Useritem";
import get from "../../lib/get";
import put from "../../lib/put";
import { useEffect } from "react";
function Admin() {
  const [usersdata, setUsersData] = useState([]);
  const authCtx = useContext(AuthContext);
  const [banned, setBanned] = useState(0);
  const handleSetBanned = () => {
    setBanned((prev) => {
      return prev + 1;
    });
  };
  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/admin")
      .then((data) => {
        setUsersData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [banned]);
  const useritems = usersdata.map((userdata) => {
    return (
      <Useritem
        name={userdata.name}
        userid={userdata.id}
        password={userdata.password}
        key={userdata.id}
        setBanned={handleSetBanned}
      />
    );
  });
  return (
    <>
      <Navbar
        Admin
        onLogout={() => {
          authCtx.logout();
        }}
      />
      <Container>
        <List>{useritems.length == 0 ? "Loading" : useritems}</List>
      </Container>
    </>
  );
}

export default Admin;
