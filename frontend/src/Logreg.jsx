//@ts-check
import {Button, ButtonGroup,Slide,TextField} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import * as React from 'react';
import "./App.css"
function Logreg() {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
      setChecked((prev) => !prev);
    };
    return (<>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" className='regloggroup'>
            <Button className="reglog" onClick={handleChange}><LoginIcon />Login</Button>
            <Button className="reglog"><AppRegistrationIcon />Register</Button>
        </ButtonGroup>
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit className="info-input-container">
        <TextField id="demo-helper-text-misaligned-no-helper" label="Name" className='info-input'/>
        </Slide></>);
}
export default Logreg;