//@ts-check
import { React, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Profile from "../../components/Profile";
import { Grid, Container, Box, IconButton, Avatar } from "@mui/material";
import Navbar from "../../components/Navbar";
import List from "@mui/material/List";
import Useritem from "./Useritem";
import get from "../../lib/get";
import put from "../../lib/put";
import { useEffect } from "react";
function Admin() {
  const [usersdata, setUsersData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const authCtx = useContext(AuthContext);
  const [banned, setBanned] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(NaN);
  // const [searchWord, setSearchWord] = useState(null);
  const handleSetBanned = () => {
    setBanned((prev) => {
      return prev + 1;
    });
  };
  console.log(selectedUserId);
  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/admin")
      .then((result) => {
        if (result.status == 201) setUsersData(result);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [banned]);
  //For implementing Search---------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (usersdata.length == 0) return;
    //when usersdata is fetched, we need to call handleSearch, since handleSearch controls dataToShow, and dataToShow controls what will be shown on screen
    handleSearch("");
  }, [usersdata]);
  const handleSearch = (searchWord) => {
    const filteredData = usersdata.filter((userdata) => {
      //if nothing is typed in the search field, show all userdata
      if (searchWord.length == 0) return true;
      else return userdata.name.includes(searchWord);
    });
    setFilteredUserData(filteredData);
  };
  //---------------------------------------------------------------------------------------------------------------------
  const useritems = filteredUserData.map((userdata) => {
    return (
      <Useritem
        name={userdata.name}
        userid={userdata.id}
        password={userdata.password}
        key={userdata.id}
        setBanned={handleSetBanned}
        onClick={() => {
          setSelectedUserId(userdata.id);
          setShowProfile(true);
        }}
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
      <Profile
        id={selectedUserId}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
    </>
  );
}

export default Admin;
