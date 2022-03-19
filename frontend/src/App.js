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
import { AuthContextProvider } from "./store/auth-context";
function App() {
  const authCtx = useContext(AuthContext);
  return (
    <AuthContextProvider>
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
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
