import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/get_events")
            .then(response => response.json())
            .then(data => setEvents(data.events))
            .catch(error => console.error("Error loading events:", error));
    }, []);
    

    const handelDateClick = (info) => {
        const title = prompt("Enter event title:");
        if (title) {
            const newEvent = { title, date: info.dateStr };

            fetch("http://localhost:5000/api/add-event", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(newEvent),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEvents([...events, newEvent]);
                }
            })
            .catch(error => console.error("Error adding event:", error));
        }
    };

    return (
        <div>
            <h2>Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handelDateClick}
            />
        </div>
    );
};


export default Calendar;
