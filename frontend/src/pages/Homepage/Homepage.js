import React from "react";
import Navbar from "../../components/Navbar";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import CreateEvent from "./CreateEvent";
import Profile from "../../components/Profile";
function Homepage() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const authCtx = useContext(AuthContext);
  const onLogout = () => {
    authCtx.logout();
  };
  return (
    <>
      <Navbar
        onLogout={onLogout}
        setShowCreateEvent={setShowCreateEvent}
        setShowProfile={setShowProfile}
      />
      <CreateEvent
        showCreateEvent={showCreateEvent}
        setShowCreateEvent={setShowCreateEvent}
      />
      <Profile setShowProfile={setShowProfile} showProfile={showProfile} />
    </>
  );
}

export default Homepage;
