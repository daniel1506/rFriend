import React, { useState } from "react";

const AuthContext = React.createContext({
  //no actual effect, since you can see we will declare them in the later part, so the code here only for readability and intelSense
  id: "",
  email: "",
  name: "",
  token: "",
  role: "",
  isLoggedIn: false,
  login: (token, id, email, name, role) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const storedToken = localStorage.getItem("token");
  const storedId = localStorage.getItem("id");
  const storedEmail = localStorage.getItem("email");
  const storedName = localStorage.getItem("name");
  const storedRole = localStorage.getItem("role");
  const [token, setToken] = useState(storedToken);
  const [id, setId] = useState(storedId);
  const [email, setEmail] = useState(storedEmail);
  const [name, setName] = useState(storedName);
  const [role, setRole] = useState(storedRole);
  const userIsLoggedIn = !!token; //The first ! is just for converting to boolean

  const loginHandler = (token, id, email, name, role) => {
    setToken(token);
    setId(id);
    setEmail(email);
    setName(name);
    setRole(role);
    //store to localStorage so that user doesn't need to login next time
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
  };

  const logoutHandler = () => {
    setToken(null);
    setId(null);
    setEmail(null);
    setName(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
  };

  //provide an interface for components to use i.e. authCtx.xxx
  const contextValue = {
    id: id,
    email: email,
    token: token,
    name: name,
    role: role,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
