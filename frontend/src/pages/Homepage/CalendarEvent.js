import React, { useState, useEffect } from 'react';

export default function getCalendarEvent() {
    const [eventList, setEventList] = React.useState([]);
    const [events, setEvents] = React.useState([]);

    function handleEvents() {
        var data = [];
        for (i = 0; i < eventList.length; i++) {
            var event = {};
            event[id] = eventList[i].id;
            event[title] = eventList[i].name;
            event[startDate] = new Date(eventList[i].startsAt);
            event[endDate] = new Date(eventList[i].startsAt + eventList[i].duration);
            event[ownerId] = eventList[i].ownerId;
            data[i] = event;
            setEvents(data);
        }       
    }

    useEffect(() => {GetEvents('https://rfriend.herokuapp.com/api/user/browse').then((r)=>{setEventList(r.event.filter((event)=>{
        if(event.isEventJoined) {
            return true;
        }
        return false;
    }))});}, []);
    useEffect(() => {handleEvents()}, [eventList]);
    return events;
}