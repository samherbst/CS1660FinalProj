import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { apiCallToGetEvents } from '../function_calls.js';
import Calendar from './Calendar';

import '../style/Home.css';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = location.state.user;

    const uid = user.uid;
    const username = user.username;
    const fname = user.fname;
    const lname = user.lname;
    const apiJwt = user.jwt;

    console.log("Welcoming user: " + fname + " " + lname + " with username: " + username + " to the homepage")


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
                <Calendar events={events} />
            </div>
        </div>
    );
}

export default Home;