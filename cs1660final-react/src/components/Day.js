import React, { useState } from 'react';
import BigDay from './BigDay';

import '../style/Day.css';

const Day = ({ date, dayEvents = [] }) => {
    const [showBigDay, setShowBigDay] = useState(false);

    const handleClick = () => {
        setShowBigDay(true);
    };

    const handleClose = () => {
        setShowBigDay(false);
    };

    return(
        <div className='dayBox' onClick={handleClick}>
            <div id='dayNum'>{date.getDate()}</div>

            {showBigDay && <BigDay date={date} events={dayEvents} onClose={handleClose} />}

            {/* Rest of your code */}
        </div>
    );
};
    
export default Day;