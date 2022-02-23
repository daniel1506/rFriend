//@ts-check
import {Button, ButtonGroup,Slide,TextField,Grid} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import * as React from 'react';
import "./App.css"
function Logreg() {
    const [logChecked, setLogChecked] = React.useState(false);
    const [regChecked, setRegChecked] = React.useState(false);
    const handleLog = () => {
      setLogChecked((prev) => !prev);
      setRegChecked(false);
    };
    const handleReg = () => {
      setRegChecked((prev) => !prev);
      setLogChecked(false);
    };
    return (<>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" className='regloggroup'>
            <Button className="reglog" onClick={handleLog}><LoginIcon />Login</Button>
            <Button className="reglog" onClick={handleReg}><AppRegistrationIcon />Register</Button>
        </ButtonGroup>
        <Slide direction="up" in={logChecked} mountOnEnter unmountOnExit className="info-input-container">
          <Grid container direction="column" alignItems="center" justify="center" gap="10px" marginTop="10px">
        <TextField id="usernameLog" label="username" className='info-input'/>
        <TextField id="passwordlog" label="password" className='info-input'/>
        <Button>Submit</Button>
        </Grid>
        </Slide>
        <Slide direction="up" in={regChecked} mountOnEnter unmountOnExit className="info-input-container">
        <Grid container direction="column" alignItems="center" justify="center" gap="10px" marginTop="10px">
        <TextField id="nameReg" label="name" className='info-input'/>
        <TextField id="usernameReg" label="username" className='info-input'/>
        <TextField id="passwordReg" label="password" className='info-input'/>
        <TextField id="passwordReg" label="confirm password" className='info-input'/>
        <Button>Submit</Button>
        </Grid>
        </Slide>
        </>
        );
}
export default Logreg;