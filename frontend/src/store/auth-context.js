import React, { useState } from "react";

const AuthContext = React.createContext({
  //no actual effect, since you can see we will declare them in the later part, so the code here only for readability and intelSense
  id: "",
  email: "",
  token: "",
  isLoggedIn: false,
  login: (token, id) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const storedToken = localStorage.getItem("token");
  const storedId = localStorage.getItem("id");
  const storedEmail = localStorage.getItem("email");
  const [token, setToken] = useState(storedToken);
  const [id, setId] = useState(storedId);
  const [email, setEmail] = useState(storedEmail);
  const userIsLoggedIn = !!token; //The first ! is just for converting to boolean

  const loginHandler = (token, id, email) => {
    setToken(token);
    setId(id);
    setEmail(email);
    //store to localStorage so that user doesn't need to login next time
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
  };

  const logoutHandler = () => {
    setToken(null);
    setId(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
  };

  //provide an interface for components to use i.e. authCtx.xxx
  const contextValue = {
    id: id,
    email: email,
    token: token,
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
