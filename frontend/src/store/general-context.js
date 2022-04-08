import React, { useState } from "react";

const GeneralContext = React.createContext({
  //we will declare and initialize them in the later part, so the code here only for readability and intelSense, no technical effect
  //notice everything you get from localStorage will be string, since we rely on localStorage, here everything will be string to let intelSense remind user these thing will be string when we access them.
  friendModified: 0,
  handleFriendModified: () => {},
});

export const GeneralContextProvider = (props) => {
  const [friendModified, setFriendModified] = useState(0);

  const handleFriendModified = () => {
    setFriendModified((prev) => {
      return prev + 1;
    });
  };

  //provide an interface for components to use i.e. generalCtx.xxx
  const contextValue = {
    friendModified: friendModified,
    handleFriendModified: handleFriendModified,
  };

  return (
    <GeneralContext.Provider value={contextValue}>
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
