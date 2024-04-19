import React from 'react';

const Day = ({ date, dayEvents }) => {
    return(
        <div className='dayBox'>
            <div id='dayNum'>{date.getDate()}</div>
            <div id='dayEvents'>
                {/* {dayEvents.map(event => (
                    <div key={event.id} className='event'>
                        <div>{event.title}</div>
                        <div>{event.time}</div>
                    </div>
                ))} */}
            </div>
        </div>
    );
};
    
export default Day;