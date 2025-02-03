import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Calendar.css";

const Calendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/get_events")
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data.events.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: event.start, // Keep the correct timestamp
                }));
                setEvents(formattedEvents);
            })
            .catch(error => console.error("Error loading events:", error));
    }, []);

    const handleDateClick = (info) => {
        const title = prompt("Enter event title:");
        const time = prompt("Enter time (HH:MM format):");

        if (title && time) {
            const dateTime = `${info.dateStr}T${time}:00`; // Convert to full timestamp
            const newEvent = { title, start: dateTime };

            fetch("http://127.0.0.1:5000/api/add_event", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(newEvent),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEvents([...events, { id: data.id, title, start: dateTime }]);
                }
            })
            .catch(error => console.error("Error adding event:", error));
        }
    };

    return (
        <div className="calendar-container">
            <h2>Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventContent={(eventInfo) => (
                    <div className="calendar-event">
                        <strong>{eventInfo.event.title}</strong>
                        <p>{new Date(eventInfo.event.start).toLocaleString()}</p> {/* Show timestamp */}
                    </div>
                )}
            />
        </div>
    );
};

export default Calendar;
