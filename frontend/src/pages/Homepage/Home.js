import React from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import EventCard from './EventCard.js';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Calendar from './Calendar.js';
import Events from './assets/Events.js';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Home() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
                <Grid item xs={8}>
                    <Calendar/>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2}>
                        {Events.map((e, index)=>{
                            return (
                                <EventCard key={index} eventName={e.eventName} hostName={e.hostName} eventTime={e.eventTime}
                                eventLocation={e.eventLocation} eventCategory={e.eventCategory} maxParticipants={e.maxParticipants} eventRemark={e.eventRemark}/>
                            );
                        })}
                    </Stack>
                </Grid>
            </Grid>
            </Box>
        </>
    );
}

ReactDOM.render(
    <Home/>,
    document.querySelector("#home")
);