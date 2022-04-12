//mode is for recording user's preference on light mode or dark mode
import React, { useState } from "react";
import { createTheme } from "@mui/material/styles";
const PrefContext = React.createContext({
  //no actual effect, since you can see we will declare them in the later part, so the code here only for readability and intelSense
  theme: {},
});

export const PrefContextProvider = (props) => {
  const storedMode = localStorage.getItem("mode");
  let mode = "";
  if (storedMode === undefined || "light") {
    mode = "light";
  }
  const [theme, setTheme] = useState(createTheme({ palette: { mode: mode } }));
  const switchModeHandler = () => {
    console.log(theme);
    if (theme.palette.mode === "light") {
      setTheme(createTheme({ palette: { mode: "dark" } }));
    } else {
      setTheme(createTheme({ palette: { mode: "light" } }));
    }

    //store to localStorage so that user doesn't need to login next time
    localStorage.setItem("mode", theme.palette.mode);
  };
  //provide an interface for components to use i.e. prefCtx.xxx
  const contextValue = {
    switchMode: switchModeHandler,
    theme: theme,
  };

  return <PrefContext.Provider value={contextValue}>{props.children}</PrefContext.Provider>;
};

export default PrefContext;
