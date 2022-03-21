//@ts-check
import { React, useState, useEffect } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Typography, Zoom, Button } from "@mui/material";
import SubmitButton from "../../components/SubmitButton";
function ConfirmReset() {
  const [clicked, setClicked] = useState(false);
  const [pop, setPop] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Zoom
        in={!clicked}
        timeout={500}
        sx={{ display: pop ? "none" : "block" }}
      >
        <Button>
          <LockResetIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      <Zoom in={pop} timeout={500} sx={{ display: pop ? "block" : "none" }}>
        <Button>
          <DoneIcon sx={{ fontSize: "200px" }} color="success" />
        </Button>
      </Zoom>
      <Typography variant="h3">Enter your new password</Typography>
      <Typography variant="h6">
        Click the button to verify your email
      </Typography>
      <SubmitButton
        onClick={() => {
          setClicked(true);
          setTimeout(() => {
            setPop(true);
          }, 500);
        }}
      >
        Submit
      </SubmitButton>
    </Box>
  );
}

export default ConfirmReset;
