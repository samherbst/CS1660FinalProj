import React, { useState } from 'react';
import BigDay from './BigDay';

import { apiCallToGetEvents } from '../function_calls';

import '../style/Day.css';

const Day = ({ date, events = [] }) => {
    const [showBigDay, setShowBigDay] = useState(false);

    // if there is an event, log it
    if (events && events.length > 0) {
        console.log("Event: ", events[0]);
    }

    const handleClick = () => {
        setShowBigDay(true);
    };

    const handleClose = () => {
        setShowBigDay(false);
    };

    return(
        <div className='dayBox' onClick={handleClick}>
            <div id='dayNum'>{date.getDate()}</div>

            {events && events.length > 0 && <div className='eventMessage'>You have events today!</div>}

        </div>
    );
};
    
export default Day;