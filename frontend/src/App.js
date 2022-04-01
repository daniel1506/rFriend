import React from "react";
import AuthContext from "./store/auth-context";
import Auth from "./Auth";
import Profile from "./components/Profile";
import Admin from "./pages/Admin/Admin";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ConfirmReset from "./pages/ConfirmReset/ConfirmReset";
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
        {/* <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ConfirmReset />} />
        <Route path="api/user/verify" element={<ConfirmEmail />} />
        <Route path="/verify" element={<VerifyEmail />} /> */}
        {authCtx.isLoggedIn && authCtx.role == "USER" && (
          <Route path="/homepage" element={<Homepage />} /> //need to login and have user role to view user page
        )}
        {authCtx.isLoggedIn && authCtx.role == "ADMIN" && (
          <Route path="/admin" element={<Admin />} /> //need to login and have admin role to view admin page
        )}
        {authCtx.isLoggedIn && authCtx.role == "USER" && (
          <Route path="*" element={<Navigate to="/homepage" />} /> //if an user wants to go to any irrevalent path, redirect it to home page
        )}
        {authCtx.isLoggedIn && authCtx.role == "ADMIN" && (
          <Route path="*" element={<Navigate to="/admin" />} /> //if an admin wants to go to any irrevalent path, redirect it to admin page
        )}
        {!authCtx.isLoggedIn && (
          <Route path="*" element={<Auth />} /> //if a unlogin user wants to go any irrevalent path, redirent it to login page
        )}
        <Route path="/reset-password/*" element={<ConfirmReset />} />
      </Routes>
    </Router>
  );
}

export default App;
