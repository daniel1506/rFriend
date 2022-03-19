//@ts-check
import { React, useState, useEffect } from "react";
import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { Box, Typography, Zoom, Button } from "@mui/material";
function ConfirmEmail() {
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
        timeout={1000}
        sx={{ display: pop ? "none" : "block" }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setClicked(true);
            setTimeout(() => {
              setPop(true);
            }, 1000);
          }}
        >
          <EmailIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      <Zoom in={pop} timeout={1000} sx={{ display: pop ? "block" : "none" }}>
        <Button variant="contained" color="success">
          <MarkEmailReadIcon sx={{ fontSize: "200px" }} />
        </Button>
      </Zoom>
      <Typography variant="h3">Verify Email</Typography>
      <Typography variant="h6">
        Click the button to verify your email
      </Typography>
    </Box>
  );
}

export default ConfirmEmail;
