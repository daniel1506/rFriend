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
import AskVerify from "./pages/AskVerify";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import PrefContext from "./store/preference-context";
function App() {
  const authCtx = useContext(AuthContext);
  const prefCtx = useContext(PrefContext);
  // const theme = createTheme({ palette: { mode: prefCtx.mode } });
  return (
    <ThemeProvider theme={prefCtx.theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ConfirmReset />} />
        <Route path="api/user/verify" element={<ConfirmEmail />} />
        <Route path="/verify" element={<VerifyEmail />} /> */}
          <Route path="/reset-password/:token" element={<ConfirmReset />} />
          {!authCtx.isLoggedIn && <Route path="/verify/:token" element={<ConfirmEmail />} />}
          {authCtx.isLoggedIn && authCtx.role == "USER" && authCtx.verified_at !== null && (
            <Route path="/homepage" element={<Homepage />} /> //need to login and have user role to view user page
          )}
          {authCtx.isLoggedIn && authCtx.role == "ADMIN" && authCtx.verified_at !== null && (
            <Route path="/admin" element={<Admin />} /> //need to login and have admin role to view admin page
          )}
          {authCtx.isLoggedIn && authCtx.role == "USER" && authCtx.verified_at !== null && (
            <Route path="*" element={<Navigate to="/homepage" />} /> //if an user wants to go to any irrevalent path, redirect it to home page
          )}
          {authCtx.isLoggedIn && authCtx.role == "ADMIN" && authCtx.verified_at !== null && (
            <Route path="*" element={<Navigate to="/admin" />} /> //if an admin wants to go to any irrevalent path, redirect it to admin page
          )}
          {authCtx.isLoggedIn && authCtx.role == "USER" && authCtx.verified_at === null && (
            <Route path="*" element={<AskVerify />} /> //if an admin wants to go to any irrevalent path, redirect it to admin page
          )}
          {(!authCtx.isLoggedIn || authCtx.verified_at === null) && (
            <Route path="*" element={<Auth />} /> //if a unlogin user wants to go any irrevalent path, redirent it to login page
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
