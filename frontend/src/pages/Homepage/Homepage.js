import React from "react";
import Navbar from "../../components/Navbar";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import CreateEvent from "./CreateEvent";
function Homepage() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const authCtx = useContext(AuthContext);
  const onLogout = () => {
    authCtx.logout();
  };
  return (
    <>
      <Navbar onLogout={onLogout} setShowCreateEvent={setShowCreateEvent} />
      <CreateEvent
        showCreateEvent={showCreateEvent}
        setShowCreateEvent={setShowCreateEvent}
      />
    </>
  );
}

export default Homepage;
