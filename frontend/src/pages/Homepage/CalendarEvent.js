import React, { useState, useEffect } from 'react';
import get from '../../lib/get';

export default function CalendarEvent({setCalendarEvent}) {
    const [eventList, setEventList] = React.useState([]);
    const [events, setEvents] = React.useState([]);

    function handleEvents() {
        var data = [];
        for (let i = 0; i < eventList.length; i++) {
            let t = new Date(eventList[i].startsAt);
            t.setSeconds(t.getSeconds() + eventList[i].duration);
            var event = {id:"", title:"", startDate:50, endDate:""};
            event.id = eventList[i].id;
            event.title = eventList[i].name;
            event.startDate = new Date(eventList[i].startsAt);
            event.endDate = t;
            //event[ownerId] = eventList[i].ownerId;
            data[i] = event;
            setEvents(data);
        }
        setCalendarEvent(data);              
    }

    useEffect(() => {get('https://rfriend.herokuapp.com/api/user/browse').then((r)=>{setEventList(r.event.filter((event)=>{
        if(event.isEventJoined) {
            return true;
        }
        return false;
    }))});}, []);
    useEffect(() => {handleEvents()}, [eventList]);

    return(<></>);
}