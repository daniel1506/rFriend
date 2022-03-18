//A helper component for quickly flex items in vertical direction
import React from "react";
import { Grid } from "@mui/material";
function VerticalFlex(props) {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      gap="10px"
      {...props}
    >
      {props.children}
    </Grid>
  );
}

export default VerticalFlex;
