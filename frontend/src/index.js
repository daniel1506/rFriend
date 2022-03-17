import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-context";
import "./index.css";
import App from "./App";
import Admin from "./pages/Admin/Admin";
import Navbar from "./components/Navbar";
import reportWebVitals from "./reportWebVitals";
ReactDOM.render(
  <AuthContextProvider>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
        </Routes>
      </Router>
    </React.StrictMode>
  </AuthContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
