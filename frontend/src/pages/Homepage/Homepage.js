import React from "react";
import Navbar from "../../components/Navbar";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
function Homepage() {
  const authCtx = useContext(AuthContext);
  const onLogout = () => {
    authCtx.logout();
  };
  return (
    <>
      <Navbar onLogout={onLogout} />
    </>
  );
}

export default Homepage;
