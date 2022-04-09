import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import EventCard from '../../components/EventCard.js';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Calendar from './Calendar.js';
import get from '../../get.js';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Home() {

    const [eventList, setEventList] = React.useState([]);

    useEffect(() => {get('https://rfriend.herokuapp.com/api/user/browse').then((r)=>{setEventList(r.event)});}, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-start">
                <Grid item xs={8}>
                    <Calendar/>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2}>
                        {eventList.map((e, index)=>{
                            return (
                                <EventCard eventId={e.id} eventName={e.name} hostId={e.ownerId} eventTime={e.startsAt} isJoined={e.isEventJoined} isLiked={e.isEventLiked}
                                host={e.owner} eventLocation={e.location} eventCategory={e.category} maxParticipants={e.maxParticipants} eventRemark={e.remarks}/>
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