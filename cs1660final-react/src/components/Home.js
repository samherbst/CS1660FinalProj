import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { apiCallToGetEvents } from '../function_calls.js';
import Calendar from './Calendar';
import BigDay from './BigDay';

import '../style/Home.css';

const Home = () => {
    const [showBigDay, setShowBigDay] = useState(false);
    const [bigDayProps, setBigDayProps] = useState({});

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
    const fname = user.fname;
    const lname = user.lname;
    const apiJwt = user.jwt;

    //console.log("Welcoming user: " + fname + " " + lname + " with username: " + username + " to the homepage")

    const handleLogout = () => {
        navigate('/');
    };

    let resp = apiCallToGetEvents(uid, apiJwt);
    let events = resp.events;

    return (
        <div className='home-page'>
            <div id='welcome'>
                <h2>Welcome {fname}</h2>
            </div>
            <button id="logout" onClick={handleLogout}>Logout</button>
            <div className='calendar'>
                {showBigDay && <BigDay {...bigDayProps} onClose={handleClose} user={user} />}
                <Calendar events={events} onDayClick={handleDayClick} />
            </div>
        </div>
    );
}

export default Home;