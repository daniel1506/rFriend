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
  const [usersDataForShow, setUsersDataForShow] = useState([]);
  const authCtx = useContext(AuthContext);
  const [banned, setBanned] = useState(0);
  // const [searchWord, setSearchWord] = useState(null);
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
  //For implementing Search---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    //when usersdata is fetched, we need to call handleSearch, since handleSearch controls dataToShow, and dataToShow controls what will be shown on screen
    handleSearch("");
  }, [usersdata]);
  const handleSearch = (searchWord) => {
    const filteredData = usersdata.filter((userdata) => {
      //if nothing is typed in the search field, show all userdata
      if (searchWord.length == 0) return true;
      else return userdata.name.includes(searchWord);
    });
    setUsersDataForShow(filteredData);
  };
  //---------------------------------------------------------------------------------------------------------------------
  const useritems = usersDataForShow.map((userdata) => {
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
        admin
        onLogout={() => {
          authCtx.logout();
        }}
        handleSearch={handleSearch}
      />
      <Container>
        <List>{useritems.length == 0 ? "no data" : useritems}</List>
      </Container>
    </>
  );
}

export default Admin;
