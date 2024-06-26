// When A day in the calendar is clicked on, I want it to blow up so there can be a piece that shows
// the events for that day as well as giving you the option to add, update, or delete events. 
// This is the BigDay component. 

import React, { useState } from 'react';
import '../style/BigDay.css';

import { apiCallToChangeEvent, apiCallToCreateEvent, apiCallToDeleteEvent } from '../function_calls';

const BigDay = ({ date, dayEvents, onClose, user, fetchEvents }) => {
    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    // const [currentId, setCurrentId] = useState(null);
    const [updateFormOpen, setUpdateFormOpen] = useState(false);
    // const [updatedEvent, setUpdatedEvent] = useState({
    //     starttime: 0,
    //     endtime: 0,
    //     name: '',
    //     desc: '',
    //     priority: 'H',
    //     eid: 0
    // });

    const handleUpdateEvent = async (formEvent,eid) => {
        formEvent.preventDefault();
        
        const form = formEvent.target;

        let hours = form.startHour.value;
        let minutes = form.startMinute.value;
        let ampm = form.startAMPM.value;
        const starttime = convertToTime(hours, minutes, ampm);

        hours = form.endHour.value;
        minutes = form.endMinute.value;
        ampm = form.endAMPM.value;

        const endtime = convertToTime(hours, minutes, ampm);

        const updateEvent = {
            eid: eid,
            uid: user.uid,
            jwtToken: user.jwt,
            starttime: starttime,
            endtime: endtime,
            date: date.toISOString().split('T')[0],
            name: form.name.value,
            desc: form.desc.value,
            priority: form.priority.value
        };


        await apiCallToChangeEvent(updateEvent);

        fetchEvents();
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

    const doDelete = async (eid) => {
        console.log("deleting event ", eid)
        await apiCallToDeleteEvent(user.uid, user.jwt, eid);

        fetchEvents();
        setCurrentEvent(null);
        setUpdateFormOpen(false);
    }

    const handleCreateEvent = async (event) => {
        event.preventDefault();
        const form = event.target;

        let hours = form.startHour.value;
        let minutes = form.startMinute.value;
        let ampm = form.startAMPM.value;
        const starttime = convertToTime(hours, minutes, ampm);

        hours = form.endHour.value;
        minutes = form.endMinute.value;
        ampm = form.endAMPM.value;

        const endtime = convertToTime(hours, minutes, ampm);

        const newEvent = {
            uid: user.uid,
            jwtToken: user.jwt,
            starttime: starttime,
            endtime: endtime,
            date: date.toISOString().split('T')[0],
            name: form.name.value,
            desc: form.desc.value,
            priority: form.priority.value
        };

        await apiCallToCreateEvent(newEvent);
        fetchEvents();
        setCreateFormOpen(false);
    }

    function convertToTime(hour, minute, ampm) {
        let hours = parseInt(hour);
        const minutes = parseInt(minute);
        if (ampm === 'PM') {
            hours += 12;
        }

        return hours + minutes + '00';
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

    function timeToEpoch(time) {
        const date = new Date();
        const hours = parseInt(time.substring(0, 2));
        const minutes = parseInt(time.substring(3, 5));
        date.setHours(hours)
        date.setMinutes(minutes);
        date.setSeconds(0);
        return Math.floor(date.getTime());
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
            {!updateFormOpen && !createFormOpen && <button id = "create_event_button" onClick={handleOpenCreateForm}>Create Event</button>}
            {createFormOpen && (
            <div id="createForm">
                <form onSubmit={handleCreateEvent}>
                    <label>
                        Start Time:
                        <select class = "start_time_drop_down" name="startHour">
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
                        <select class = "end_time_drop_down" name="endHour">
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
                        <input class = "form_name" type="text" name="name" />
                    </label>
                    <label>
                        Description:
                        <textarea class="description_box" name="desc" rows="4" cols="50"></textarea>
                    </label>
                    <label>
                        Priority:
                        <select name="priority" class ="prioritybox">
                            <option value="H">High</option>
                            <option value="M">Medium</option>
                            <option value="L">Low</option>
                        </select>
                    </label>
                    <button  class = "form_submit_button">Submit</button>
                </form>
                <button class = "form_cancel_button" onClick={() => setCreateFormOpen(false)}>Cancel</button>
            </div>
            )}
            {sortedEvents.map((event, index) => ( 
                event && <div id = "update_form_div" key={index}>
                    <p id = "event_text"><strong class ="priority" id={event.priority}>{event.name}</strong><br />
                    {   convertEpochToTime(timeToEpoch(event.starttime))} - {convertEpochToTime(timeToEpoch(event.endtime))}<br />
                    {event.descr}
                    </p>

                    {(!updateFormOpen || currentEvent.eid !== event.id) && 
                    <div>
                        {!updateFormOpen && 
                            <div>
                                <button id = "delete_button" onClick={() => doDelete(event.eid)}>Delete</button>
                                {/* <button id = "update_button" onClick={() => doUpdate(event, event.eid)}>Update</button> */}
                            </div>
                        }
                    </div>
                    }
                    {updateFormOpen && currentEvent.eid === event.eid && (
                    <div className="form" id="updateForm">
                        <form onSubmit={handleUpdateEvent}>
                            <label>
                                Name:
                                <input class = "form_name" type="text" name="name" value={currentEvent.name} />
                            </label>
                            <label>
                        Start Time:
                        <select class = "start_time_drop_down" name="startHour" defaultValue={convertFromEpoch(timeToEpoch(event.starttime)).hours}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="startMinute" defaultValue={convertFromEpoch(timeToEpoch(event.starttime)).minutes}>
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="startAMPM" defaultValue={convertFromEpoch(timeToEpoch(event.starttime)).ampm}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                    <label>
                        End Time:
                        <select class = "end_time_drop_down" name="endHour" defaultValue={convertFromEpoch(timeToEpoch(event.endtime)).hours}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <option key={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>:
                        <select name="endMinute" defaultValue={convertFromEpoch(timeToEpoch(event.endtime)).minutes}>
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <select name="endAMPM" defaultValue={convertFromEpoch(timeToEpoch(event.endtime)).ampm}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </label>
                            <label>
                                Description:
                                <textarea class="description_box" name="desc" rows="4" cols="50" defaultValue={currentEvent.descr}></textarea>
                            </label>
                            <label>
                                Priority:
                                <select name="priority" value={currentEvent.priority} class ="prioritybox">
                                    <option value="H">High</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Low</option>
                                </select>
                            </label>
                            <button  class = "form_submit_button">Submit</button>
                        </form>
                        <button class = "form_cancel_button" onClick={() => setUpdateFormOpen(false)}>Cancel</button>
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