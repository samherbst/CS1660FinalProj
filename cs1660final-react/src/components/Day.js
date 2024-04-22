import React from 'react';

import { apiCallToGetEvents } from '../function_calls';

import '../style/Day.css';

const Day = ({ date, events = [], dayClick }) => {
    let low_priority = 0;
    let medium_priority = 0;
    let high_priority = 0;

    for (let i = 0; i < events.length; i++) {
        if (events[i].priority === "L") {
            low_priority++;
        } else if (events[i].priority === "M") {
            medium_priority++;
        } else if (events[i].priority === "H") {
            high_priority++;
        }
    }

    let eventCount = events.length;

    const handleClick = () => {
        dayClick(date, events);
    };

    return(
        <div className='dayBox' onClick={handleClick}>
            <div id='dayNum'>{date.getDate()}</div>
            <div id="eventText">
                {
                    events && events.length > 0 && 
                    <div className='eventMessage'>
                        {<div id="events">{eventCount} tasks:</div>}
                        <div id="Priority">
                            {high_priority > 0 && <div className="pri_box" id="high_priority">High: {high_priority}</div>}
                            {medium_priority > 0 && <div className="pri_box" id="medium_priority">Medium: {medium_priority}</div>}
                            {low_priority > 0 && <div className="pri_box" id="low_priority">Low: {low_priority}</div>}
                        </div>
                    </div>
                }
            </div>
            {/* {showBigDay && <BigDay date={date} events={events} onClose={() => handleClose()} />} */}
        </div>
    );
};
    
export default Day;