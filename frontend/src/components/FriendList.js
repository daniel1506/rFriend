//@ts-check
import React from "react";
import FriendShowCase from "./FriendShowCase";
import get from "../lib/get";
import deleteReq from "../lib/delete";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import VerticalFlex from "../layout/VerticalFlex";
import Profile from "./Profile";
function FriendList() {
  const [friendLoading, setFriendLoading] = React.useState(false);
  const [friendFailed, setFriendFailed] = React.useState(false);
  const [friends, setFriends] = React.useState([{ name: "", id: "" }]);
  const [pendingFriends, setPendingFriends] = React.useState([
    { name: "", id: "" },
  ]);
  const [deleted, setDeleted] = React.useState(0);
  const [showProfile, setShowProfile] = React.useState(false);
  const [selectedFriendId, setSelectedFriendId] = React.useState("");
  const [pendingSelected, setPendingSelected] = React.useState(false);
  const handleDeleted = () => {
    setDeleted((prev) => {
      return prev + 1;
    });
  };
  useEffect(() => {
    setFriendLoading(true);
    get("https://rfriend.herokuapp.com/api/friend")
      .then((result) => {
        console.log(result);
        if (result.status != 200) {
          setFriendFailed(true);
        } else {
          setFriendLoading(false);
          setFriends(result.friends);
          setPendingFriends(result.pending_users);
          // console.log(result.pending_users);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleted]);
  let FriendShowCases = friends.map((friend) => {
    return (
      <FriendShowCase
        name={friend.name}
        key={friend.id}
        id={friend.id}
        proPic={friend.profile_url}
        onClick={() => {
          setSelectedFriendId(friend.id);
          setShowProfile(true);
          setPendingSelected(false);
        }}
      />
    );
  });
  let PendingFriendShowCases = pendingFriends.map((pending_user) => {
    return (
      <FriendShowCase
        name={pending_user.name}
        key={pending_user.id}
        id={pending_user.id}
        proPic={pending_user.profile_url}
        onClick={() => {
          setSelectedFriendId(pending_user.id);
          setShowProfile(true);
          setPendingSelected(true);
        }}
        pending
      />
    );
  });
  if (friendLoading)
    return (
      <VerticalFlex>
        <CircularProgress />
      </VerticalFlex>
    );
  if (friendFailed) return <VerticalFlex>Failed to get friends.</VerticalFlex>;
  return (
    <>
      {FriendShowCases}
      {PendingFriendShowCases}
      <Profile
        id={selectedFriendId}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        admin={pendingSelected}
      />
    </>
  );
}

export default FriendList;
