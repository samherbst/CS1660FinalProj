import React, { useState, useEffect, useCallback } from 'react';
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

    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state.user;
    const uid = user.uid;
    const username = user.username;
    const apiJwt = user.jwt;

    const fetchEvents = useCallback(async () => {
        try {
            const events = await apiCallToGetEvents(uid, apiJwt);
            setEvents(events);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setIsLoading(false);
        }
    }, [apiJwt, uid]);

    useEffect(() => {
        fetchEvents();

    }, [fetchEvents]); // Include fetchEvents in the dependency array

    const handleDayClick = (date, dayEvents) => {
        setBigDayProps({ date, dayEvents });
        setShowBigDay(true);
    };

    const handleClose = () => {
        setShowBigDay(false);
    };

    const handleLogout = () => {
        navigate('/');
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