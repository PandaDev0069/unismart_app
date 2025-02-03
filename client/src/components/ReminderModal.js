import React, { useState } from "react";
import "./ReminderModal.css"; // We'll create this file for styling.

const ReminderModal = ({ isOpen, onClose, onSave }) => {
  const [reminderText, setReminderText] = useState("");

  if (!isOpen) return null; // Don't render if modal is closed.

  const handleSave = () => {
    if (reminderText.trim() !== "") {
      onSave(reminderText);
      setReminderText(""); // Clear input after saving
      onClose(); // Close the modal
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h3>Add Reminder</h3>
        <textarea
          placeholder="Enter reminder..."
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
