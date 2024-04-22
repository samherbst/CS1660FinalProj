// When A day in the calendar is clicked on, I want it to blow up so there can be a piece that shows
// the events for that day as well as giving you the option to add, update, or delete events. 
// This is the BigDay component. 

import React from 'react';
import '../style/BigDay.css';

import { apiCallToChangeEvent, apiCallToCreateEvent, apiCallToDeleteEvent } from '../function_calls';

const BigDay = ({ date, dayEvents, onClose, user }) => {
    const [createFormOpen, setCreateFormOpen] = React.useState(false);
    const [currentEvent, setCurrentEvent] = React.useState(null);
    const [updateFormOpen, setUpdateFormOpen] = React.useState(false);
    const [updatedEvent, setUpdatedEvent] = React.useState({
        starttime: '',
        endtime: '',
        name: '',
        desc: '',
        priority: ''
    });

    const doUpdate = (event) => {
        setCurrentEvent(event);
        setUpdatedEvent({
            starttime: event.starttime,
            endtime: event.endtime,
            name: event.name,
            desc: event.desc,
            priority: event.priority
        });
        setUpdateFormOpen(true);
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
        const newEvent = {
            starttime: parseInt(form.starttime.value),
            endtime: parseInt(form.endtime.value),
            name: form.name.value,
            desc: form.desc.value,
            priority: form.priority.value
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
            <h4>Events for {date.toDateString()}</h4>
            <div id='bigDayEvents'>
            <button onClick={handleOpenCreateForm}>Create Event</button>
            {createFormOpen && (
            <div className="form" id="createForm">
                <form onSubmit={handleCreateEvent}>
                    <label>
                        Start Time:
                        <input type="number" name="starttime" />
                    </label>
                    <label>
                        End Time:
                        <input type="number" name="endtime" />
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
                        <input type="text" name="priority" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={() => setCreateFormOpen(false)}>Cancel</button>
            </div>
            )}
            {updateFormOpen && (
            <div className="form" id="updateForm">
                <form onSubmit={handleUpdateEvent}>
                    <label>
                        Start Time:
                        <input type="number" name="starttime" />
                    </label>
                    <label>
                        End Time:
                        <input type="number" name="endtime" />
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
                        <input type="text" name="priority" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={() => setUpdateFormOpen(false)}>Cancel</button>
            </div>
            )}
            {sortedEvents.map((event, index) => (
                <div key={index}>
                    <p><strong className="priority" id={event.priority}>{event.name}</strong><br />
                    {convertEpochToTime(event.starttime)} - {convertEpochToTime(event.endtime)}<br />
                    {event.desc}
                    </p>
                    <button onClick={() => doDelete(event.eid)}>Delete</button>
                    <button onClick={() => doUpdate(event)}>Update</button>
                </div>
            ))}
            </div>
            <button id="doneButton" onClick={handleClose}>Done</button>
        </div>
    );
};

export default BigDay;