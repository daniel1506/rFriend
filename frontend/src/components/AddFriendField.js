import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Input,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AuthContext from "../store/auth-context";
import { useContext, useState } from "react";
import put from "../lib/put";
import ResultDisplay from "./ResultDisplay";
import LoadingIcon from "./LoadingIcon";
function AddFriendField() {
  const [adding, setAdding] = useState(false);
  const [addFailed, setAddFailed] = useState(false);
  const [friendId, setFriendId] = useState(NaN);
  const authCtx = useContext(AuthContext);
  const addFriend = () => {
    let data = { id: authCtx.id };
    setAdding(true);
    put("https://rfriend.herokuapp.com/api/friend/request", data)
      .then((result) => {
        setAdding(false);
        if (result.status != 200) {
          setAddFailed(true);
        } else setAddFailed(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="addFriend">Type friend id</InputLabel>
        <OutlinedInput
          id="addFriend"
          type="number"
          label="Type friend id" //without label attribute, the label will overlap with the border of input field visually
          endAdornment={
            <InputAdornment position="end">
              {!adding && (
                <IconButton
                  aria-label="toggle friend visibility"
                  onClick={addFriend}
                  edge="end"
                  color="info"
                >
                  <GroupAddIcon />
                </IconButton>
              )}
              {adding && <LoadingIcon />}
            </InputAdornment>
          }
          value={friendId} //since we don't allow negative value for friend id, so we are using react bidirectional binding here
          onChange={(e) => {
            console.log(e);
            if (e.target.value > 0) setFriendId(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </FormControl>
    </>
  );
}

export default AddFriendField;
