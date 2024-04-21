// When A day in the calendar is clicked on, I want it to blow up so there can be a piece that shows
// the events for that day as well as giving you the option to add, update, or delete events. 
// This is the BigDay component. 

import React from 'react';

const BigDay = ({ date, dayEvents, onClose }) => {
    const handleClick = (event) => {
        event.stopPropagation();
    };
    
    return(
        <div className='bigDayBox'>
            <div id='bigDayNum'>{date.getDate()}</div>
            <div id='bigDayEvents'>
                Hello
                {/* {dayEvents.map(event => (
                    <div key={event.id} className='event'>
                        <div>{event.title}</div>
                        <div>{event.time}</div>
                    </div>
                ))} */}
               <button onClick={(event) => { event.stopPropagation(); onClose(); }}>Close</button>
            </div>
        </div>
    );
};

export default BigDay;