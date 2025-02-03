import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Calendar.css";
import Dashboard from './Dashboard';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(null); // Stores selected dated
    
    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
    };

    return (
        <div className='calendar-container'>
            {selectedDate ? (
                <Dashboard selectedDate={selectedDate} onClose={() => setSelectedDate(null)} />
            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
                    dateClick={handleDateClick}
                />
            )}
        </div>
    );
};

export default Calendar;

