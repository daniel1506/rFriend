import React from "react";
import AuthContext from "./store/auth-context";
import Auth from "./Auth";
import Profile from "./components/Profile";
import Admin from "./pages/Admin/Admin";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        {!authCtx.isLoggedIn && <Route exact path="/" element={<Auth />} />}
        {authCtx.isLoggedIn && (
          <Route path="/homepage" element={<Homepage />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="*" element={<Navigate to="/homepage" />} />
        )}
        {!authCtx.isLoggedIn && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
