import React from "react";
import Navbar from "../../components/Navbar";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import CreateEvent from "./CreateEvent";
import Profile from "../../components/Profile";
import MapsView from "./MapsView";
import Home from "./Home";
import EventBrowser from "./EventBrowser";
import GeneralContext from "../../store/general-context";

function Homepage() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const authCtx = useContext(AuthContext);
  const onLogout = () => {
    authCtx.logout();
  };

  const { viewSelected } = useContext(GeneralContext);
  console.log(viewSelected);
  return (
    <>
      <Navbar
        onLogout={onLogout}
        setShowCreateEvent={setShowCreateEvent}
        setShowProfile={setShowProfile}
        handleSearch={setSearchWord}
      />
      <CreateEvent showCreateEvent={showCreateEvent} setShowCreateEvent={setShowCreateEvent} />
      <Profile setShowProfile={setShowProfile} showProfile={showProfile} admin />
      {viewSelected === "mapView" && <MapsView />}
      {viewSelected === "myEvents" && <Home />}
      {(viewSelected === "gridView" || viewSelected === "") && <EventBrowser searchKey={searchWord} />}
    </>
  );
}

export default Homepage;
