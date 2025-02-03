import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "./Calendar.css";

const Calendar = () => {
  const navigate = useNavigate();

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr; // Get selected date
    navigate(`/dashboard/${selectedDate}`); // Navigate to dashboard for that date
  };

  return (
    <div className="calendar-container">
      <h2>📅 Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default Calendar;
