//mode is for recording user's preference on light mode or dark mode
import React, { useState } from "react";

const PrefContext = React.createContext({
  //no actual effect, since you can see we will declare them in the later part, so the code here only for readability and intelSense
  mode: "",
});

export const PrefContextProvider = (props) => {
  const storedMode = localStorage.getItem("mode");
  const [mode, setMode] = useState(storedMode);

  const switchModeHandler = (mode) => {
    setMode(mode);
    //store to localStorage so that user doesn't need to login next time
    localStorage.setItem("mode", mode);
  };
  //provide an interface for components to use i.e. authCtx.xxx
  const contextValue = {
    mode: mode,
  };

  return (
    <PrefContext.Provider value={contextValue}>
      {props.children}
    </PrefContext.Provider>
  );
};

export default PrefContext;
