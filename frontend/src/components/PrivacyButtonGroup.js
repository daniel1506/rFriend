//This component carrys a hardcoded selection for user to choose privacy between private, friends, friends of friends, the reason why it's hardcoded is because this group of button is common in social website
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SquareToggleButton from "./SquareToggleButton";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
function PrivacyButtonGroup(props) {
  return (
    <ToggleButtonGroup exclusive aria-label="privacy" {...props}>
      <SquareToggleButton value="private" aria-label="private">
        <Tooltip title="Only you can view this event">
          <LockIcon />
        </Tooltip>
      </SquareToggleButton>

      <SquareToggleButton value="friend" aria-label="friend">
        <Tooltip title="Your friends can view this event">
          <GroupIcon />
        </Tooltip>
      </SquareToggleButton>

      <SquareToggleButton value="fof" aria-label="fof">
        <Tooltip title="Even friends of your friends can view this event">
          <GroupAddIcon />
        </Tooltip>
      </SquareToggleButton>
    </ToggleButtonGroup>
  );
}
export default PrivacyButtonGroup;
