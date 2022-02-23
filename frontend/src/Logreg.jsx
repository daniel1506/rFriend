//@ts-check
import {Button, ButtonGroup,Slide,TextField,Grid} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import * as React from 'react';
import "./App.css";
import Axios from 'axios';
function Logreg() {
    const [logChecked, setLogChecked] = React.useState(false);
    const [regChecked, setRegChecked] = React.useState(false);
    const [username, setUsername] = React.useState(null);
    const [email,setEmail]=React.useState(null);
    const [password,setPassword]=React.useState(null);
    const handleLog = () => {
      setLogChecked((prev) => !prev);
      setRegChecked(false);
    };
    const handleReg = () => {
      setRegChecked((prev) => !prev);
      setLogChecked(false);
    };
    const addUser=()=>{
      console.log({email,username,password});
      Axios.post('http://',{email,username,password}).then((response)=>{console.log("done")}).catch((err)=>{console.log(err)})
    }
    return (<>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" className='regloggroup'>
            <Button className="reglog" onClick={handleLog}><LoginIcon />Login</Button>
            <Button className="reglog" onClick={handleReg}><AppRegistrationIcon />Register</Button>
        </ButtonGroup>
        <Slide direction="up" in={logChecked} mountOnEnter unmountOnExit className="info-input-container">
          <Grid container direction="column" alignItems="center" justify="center" gap="10px" marginTop="10px">
        <TextField id="usernameLog" label="username" className='info-input'/>
        <TextField id="passwordlog" type="password" label="password" className='info-input'/>
        <Button>Submit</Button>
        </Grid>
        </Slide>
        <Slide direction="up" in={regChecked} mountOnEnter unmountOnExit className="info-input-container">
        <Grid container direction="column" alignItems="center" justify="center" gap="10px" marginTop="10px">
        <TextField id="emailReg" type="email" label="email" className='email-input' onChange={(e)=>{setEmail(e.target.value)}}/>
        <TextField id="usernameReg" label="username" className='info-input' onChange={(e)=>{setUsername(e.target.value)}}/>
        <TextField id="passwordReg" type="password" label="password" className='info-input' onChange={(e)=>{setPassword(e.target.value)}}/>
        <TextField id="passwordReg" type="password" label="confirm password" className='info-input'/>
        <Button onClick={addUser}>Submit</Button>
        </Grid>
        </Slide>
        </>
        );
}
export default Logreg;