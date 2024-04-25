import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { apiCallToGetEvents } from '../function_calls.js';
import Calendar from './Calendar';
import BigDay from './BigDay';

import '../style/Home.css';

const Home = () => {
    const [showBigDay, setShowBigDay] = useState(false);
    const [bigDayProps, setBigDayProps] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const handleDayClick = (date, dayEvents) => {
        setBigDayProps({ date, dayEvents });
        setShowBigDay(true);
    };

    const handleClose = () => {
        setShowBigDay(false);
    };

    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state.user;

    const uid = user.uid;
    const username = user.username;
    const apiJwt = user.jwt;

    /* eslint-enable react-hooks/exhaustive-deps */
    const fetchEvents = async () => {
        const events = await getEvents(apiJwt, uid);
        setEvents(events);
        setIsLoading(false);
    };
    useEffect(() => {
        fetchEvents();
    }, [apiJwt, uid, fetchEvents]);
    const handleLogout = () => {
        navigate('/');
    };
    /* eslint-enable react-hooks/exhaustive-deps */

    const getEvents = async (apiJwt, uid) => {
        const events = await apiCallToGetEvents(uid, apiJwt);
        // console.log("debug");
        // console.log(events.eventlist);
        return events;
    };

    return (
        <div className='home-page'>
            <div id='welcome'>
                <h2>Welcome {username}</h2>
            </div>
            <button id="logout" onClick={handleLogout}>Logout</button>
            <div className='calendar'>
                {showBigDay && <BigDay {...bigDayProps} onClose={handleClose} user={user} fetchEvents={fetchEvents}/>}
                {!isLoading && <Calendar events={events} onDayClick={handleDayClick} />}
            </div>
        </div>
    );
}

export default Home;