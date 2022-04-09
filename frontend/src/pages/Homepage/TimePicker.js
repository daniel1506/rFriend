import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

export default function BasicDateTimePicker(props) {
  const [value, setValue] = React.useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={value}
        onChange={(newValue) => {
          let unixTimeStamp = Math.floor(newValue.getTime() / 1000);
          console.log(typeof newValue);
          console.log(unixTimeStamp);
          props.setTime(unixTimeStamp);
          setValue(newValue);
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}
