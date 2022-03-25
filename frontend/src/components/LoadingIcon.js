//Since the official mui loading icon is not animated, that's boring, so I make it animated and reusable
import React from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import "../css/custom.css";
function LoadingIcon(props) {
  return <AutorenewIcon className="rotate" color="primary" {...props} />;
}

export default LoadingIcon;
