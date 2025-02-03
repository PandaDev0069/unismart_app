import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const generateTimestamps = () => {
  const timestamps = [];
  for (let i = 0; i < 24; i++) {
    timestamps.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return timestamps;
};

const Dashboard = ({ selectedDate, onClose }) => {
  const [reminders, setReminders] = useState({});
  const [inputValues, setInputValues] = useState({});

  // Fetch existing reminders from the database when the dashboard opens
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/get_reminders/${selectedDate}`)
      .then((response) => response.json())
      .then((data) => setReminders(data.reminders || {}))
      .catch((error) => console.error("Error loading reminders:", error));
  }, [selectedDate]);

  const handleAddReminder = (timestamp) => {
    if (!inputValues[timestamp]) return;

    const newReminder = {
      time: timestamp,
      text: inputValues[timestamp],
      date: selectedDate,
    };

    // Send new reminder to the server
    fetch("http://127.0.0.1:5000/api/add_reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReminders((prev) => ({ ...prev, [timestamp]: inputValues[timestamp] }));
          setInputValues({ ...inputValues, [timestamp]: "" });
        }
      })
      .catch((error) => console.error("Error adding reminder:", error));
  };

  return (
    <div className="dashboard-container">
      <button className="back-btn" onClick={onClose}>⬅ Back to Calendar</button>
      <h2>Schedule for {selectedDate}</h2>
      <div className="dashboard-content">
        {generateTimestamps().map((timestamp) => (
          <div key={timestamp} className="timestamp">
            <span>{timestamp}</span>
            <input
              type="text"
              value={inputValues[timestamp] || ""}
              onChange={(e) => setInputValues({ ...inputValues, [timestamp]: e.target.value })}
              placeholder="Add reminder..."
            />
            <button onClick={() => handleAddReminder(timestamp)}>➕</button>
            <p>{reminders[timestamp]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
