import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import deleteReq from "../lib/delete";

//import { withStyles } from 'material-ui/styles';

class EventCardSettingBtn extends React.Component {
  state = {
    anchorEl: null,
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleOnClick = (link) => {
    if (link == "Delete Event") {
      deleteReq("/api/event/" + this.props.eventId, { event_id: this.props.eventId });
    }
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const Wrapper = this.props.iconType;
    const listItems = this.props.items.map((link) => (
      <MenuItem onClick={this.handleOnClick(link)} key={link}>
        {link}
      </MenuItem>
    ));

    return (
      <div>
        <IconButton aria-owns={open ? "menu-appbar" : null} aria-haspopup="true" onClick={this.handleMenu}>
          {<Wrapper />}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={this.handleClose}
        >
          {listItems}
        </Menu>
      </div>
    );
  }
}

export default EventCardSettingBtn;
