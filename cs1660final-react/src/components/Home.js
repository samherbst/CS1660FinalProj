import React from 'react';
import { useParams } from 'react-router-dom';

import { apiCallToGetEvents } from '../function_calls.js';
import Calendar from './Calendar';

import '../style/Home.css';

const Home = ({location}) => {
    const user = location.state.user;

    const uid = user.uid;
    const username = user.username;
    const fname = user.fname;
    const lname = user.lname;
    const apiJwt = user.jwt;

    let resp = apiCallToGetEvents(uid, apiJwt);
    let events = resp.events;

    return (
        <div className='home-page'>
            <h2>Welcome {username}</h2>
            <Calendar events={events}/>
        </div>
    );
}

export default Home;