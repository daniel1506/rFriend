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
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ConfirmReset />} />
        <Route path="api/user/verify" element={<ConfirmEmail />} />
        <Route path="/verify" element={<VerifyEmail />} />
        {!authCtx.isLoggedIn && <Route exact path="/" element={<Auth />} />}
        {authCtx.isLoggedIn && authCtx.role == "USER" && (
          <Route path="/homepage" element={<Homepage />} />
        )}
        {authCtx.isLoggedIn && authCtx.role == "ADMIN" && (
          <Route path="/admin" element={<Admin />} />
        )}
        {authCtx.isLoggedIn && authCtx.role == "USER" && (
          <Route path="*" element={<Navigate to="/homepage" />} />
        )}
        {authCtx.isLoggedIn && authCtx.role == "ADMIN" && (
          <Route path="*" element={<Navigate to="/admin" />} />
        )}
        {!authCtx.isLoggedIn && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
