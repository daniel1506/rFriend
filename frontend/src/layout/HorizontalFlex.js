//A helper component for quickly flex items in vertical direction
import React from "react";
import { Grid } from "@mui/material";
function HorizontalFlex(props) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap="10px"
      {...props}
    >
      {props.children}
    </Grid>
  );
}

export default HorizontalFlex;
