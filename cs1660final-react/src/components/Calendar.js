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

const Calendar = (props) => { 
    // get current date
    let today = new Date();
    let currMonth = monthToWord(today.getMonth()) + " " + today.getFullYear();
  
    const dates = [];
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Find the day of the week for the first day of the month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(today.getFullYear(), today.getMonth(), i);
        const eventsOnThisDay = props.events.filter(event => {
            const eventDate = new Date(event.starttime * 1000); // Convert to milliseconds
            return eventDate.getFullYear() === currentDate.getFullYear() &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getDate() === currentDate.getDate();
        });
        dates.push({
            date: currentDate,
            events: eventsOnThisDay
        });
    }

    return (
        <div>
            <h3>{currMonth}</h3>
            <div className="calendar" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {daysOfWeek.map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
                {Array(firstDayOfMonth).fill(null).map((_, index) => <div key={index} />)}
                {dates.map((dateObj, index) => (
                    <Day key={index + firstDayOfMonth} date={dateObj.date} events={dateObj.events} dayClick={props.onDayClick}/>
                ))}
            </div>
        </div>
    );
  };

export default Calendar;