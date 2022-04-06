//A helper component for quickly flex items in vertical direction
import React from "react";
import { Box } from "@mui/material";
function VerticalFlex(props) {
  return (
    <Box
      display={{ xs: "flex" }}
      flexDirection={{ xs: "column" }}
      alignItems={{ xs: "center" }}
      justifyContent={{ xs: "center" }}
      {...props}
    >
      {props.children}
    </Box>
  );
}

export default VerticalFlex;
