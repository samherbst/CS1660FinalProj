import React from 'react';
import '../style/Calendar.css';

import Day from './Day';

function monthToWord(month) {
    switch(month) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "Invalid month";
    }
}

function eventInMonth(event, month) {
    
}

const Calendar = (props) => {
    for (let i = 0; i < props.events.length; i++) {
        console.log("Event: ", props.events[i])
    }
 
    // get current date
    let today = new Date();
    let currMonth = monthToWord(today.getMonth()) + " " + today.getFullYear();
  
    const dates = [];
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
  
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Find the day of the week for the first day of the month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
    return (
        <div>
            <h3>{currMonth}</h3>
            <div className="calendar" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {daysOfWeek.map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
                {Array(firstDayOfMonth).fill(null).map((_, index) => <div key={index} />)}
                {dates.map((date, index) => (
                    <Day key={index + firstDayOfMonth} date={date} />
                ))}
            </div>
        </div>
    );
  };

export default Calendar;