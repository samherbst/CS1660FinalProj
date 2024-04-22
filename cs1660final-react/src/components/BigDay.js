// When A day in the calendar is clicked on, I want it to blow up so there can be a piece that shows
// the events for that day as well as giving you the option to add, update, or delete events. 
// This is the BigDay component. 

import React, { useState } from 'react';
import '../style/BigDay.css';

import { apiCallToChangeEvent, apiCallToCreateEvent, apiCallToDeleteEvent } from '../function_calls';

const BigDay = ({ date, dayEvents, onClose, user }) => {
    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [updateFormOpen, setUpdateFormOpen] = useState(false);
    const [updatedEvent, setUpdatedEvent] = useState({
        starttime: 0,
        endtime: 0,
        name: '',
        desc: '',
        priority: 'H'
    });

    const doUpdate = (event) => {
        setUpdateFormOpen(true);
        setCurrentEvent(event);
        setUpdatedEvent({
            starttime: event.starttime,
            endtime: event.endtime,
            name: event.name,
            desc: event.desc,
            priority: event.priority
        });
    }

    const handleUpdateEvent = (event) => {
        event.preventDefault();

        apiCallToChangeEvent(user.uid, user.jwt, currentEvent.eid, updatedEvent);
        
        setCurrentEvent(null);
        setUpdateFormOpen(false);
        // Optionally, you can refresh the events list here
    }

    const handleOpenCreateForm = () => {
        setCreateFormOpen(true);
    }

    const handleClose = (event) => {
        event.stopPropagation();
        onClose();
    };
    const doDelete = (eid) => {
        apiCallToDeleteEvent(user.uid, user.jwt, eid);
    }

    const handleCreateEvent = (event) => {
        event.preventDefault();
        const form = event.target;

        console.log()

        const newEvent = {
            starttime: parseInt(form.starttime.value),
            endtime: parseInt(form.endtime.value),
            name: form.name.value,
            desc: form.desc.value,
            priority: form.priority.value
        };

        apiCallToCreateEvent(user.uid, user.jwt, newEvent);
    }

    function convertToEpoch (date, hour, minute, ampm) {
        date.setHours(hour + (ampm === 'PM' ? 12 : 0));
        date.setMinutes(minute);
        date.setSeconds(0);
        return Math.floor(date.getTime());
    }

    function convertFromEpoch(epoch) {
        const date = new Date(epoch); // Convert epoch to milliseconds
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert from 24 hour to 12 hour format and adjust for midnight and noon
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }
    
        // Add leading zero to minutes if less than 10
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
    
        return {
            hours,
            minutes,
            ampm
        };
    }

    const convertEpochToTime = (epoch) => {
        const date = new Date(epoch);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${hours.toString()}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    const sortedEvents = dayEvents.sort((a, b) => {
        const timeDifference = new Date(a.starttime) - new Date(b.starttime);
        if (timeDifference !== 0) {
            return timeDifference;
        } else {
            const priorityOrder = { 'H': 1, 'M': 2, 'L': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
    });
    
    return(
        <div className='bigDayBox'>
            <h4 id = "title_big_day">Events for {date.toDateString()}</h4>
            <div id='bigDayEvents'>
            {!updateFormOpen && <button id = "create_event_button" onClick={handleOpenCreateForm}>Create Event</button>}
            {createFormOpen && (
            <div className="form" id="createForm">
                <form onSubmit={handleCreateEvent}>
                    <label>
                        Start Time:
                        <select name="startHour">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="startMinute">
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="startAMPM">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                    <label>
                        End Time:
                        <select name="endHour">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="endMinute">
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="endAMPM">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                    <label>
                        Name:
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="desc" />
                    </label>
                    <label>
                        Priority:
                        <select name="priority" className="prioritybox">
                            <option value="H">High</option>
                            <option value="M">Medium</option>
                            <option value="L">Low</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" className="submitbutton"/>
                </form>
                <button onClick={() => setCreateFormOpen(false)}>Cancel</button>
            </div>
            )}
            {sortedEvents.map((event, index) => ( 
                event && <div key={index}>
                    <p id = "event_text"><strong class ="priority" id={event.priority}>{event.name}</strong><br />
                    {convertEpochToTime(event.starttime)} - {convertEpochToTime(event.endtime)}<br />
                    {event.desc}
                    </p>

                    {(!updateFormOpen || currentEvent.eid !== event.id) && 
                    <div>
                        {!updateFormOpen && 
                            <div>
                                <button id = "delete_button" onClick={() => doDelete(event.eid)}>Delete</button>
                                <button id = "update_button" onClick={() => doUpdate(event)}>Update</button>
                            </div>
                        }
                    </div>
                    }
                    {updateFormOpen && currentEvent.eid === event.eid && (
                    <div className="form" id="updateForm">
                        <form onSubmit={handleUpdateEvent}>
                            <label>
                                Name:
                                <input id = "update_form_name" type="text" name="name" value={currentEvent.name} />
                            </label>
                            <label>
                        Start Time:
                        <select id = "start_time_drop_down" name="startHour" defaultValue={convertFromEpoch(event.starttime).hours}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="startMinute" defaultValue={convertFromEpoch(event.starttime).minutes}>
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="startAMPM" defaultValue={convertFromEpoch(event.starttime).ampm}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                    <label>
                        End Time:
                        <select id = "end_time_drop_down" name="endHour" defaultValue={convertFromEpoch(event.endtime).hours}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="endMinute" defaultValue={convertFromEpoch(event.endtime).minutes}>
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="endAMPM" defaultValue={convertFromEpoch(event.endtime).ampm}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                            <label>
                                Description:
                                <input type="text" name="desc" value={currentEvent.desc} />
                            </label>
                            <label>
                                Priority:
                                <select name="priority" value={currentEvent.priority} className="prioritybox">
                                    <option value="H">High</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Low</option>
                                </select>
                            </label>
                            <input type="submit" value="Submit" className="submitbutton"/>
                        </form>
                        <button onClick={() => setUpdateFormOpen(false)}>Cancel</button>
                    </div>
            )}
                </div>
            ))}
            </div>
            <button id="doneButton" onClick={handleClose}>Done</button>
        </div>
    );
};

export default BigDay;