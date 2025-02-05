import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReminderModal from "./ReminderModal";
import { 
  getTasksByDate, 
  getRemindersByDate, 
  addReminder, 
  addTask as apiAddTask,
  editReminder,
  editTask as apiEditTask 
} from '../API';
import "./Dashboard.css";

const Dashboard = () => {
  const { date } = useParams(); // Get the selected date
  const [reminders, setReminders] = useState({}); // Store reminders by time slot
  const [tasks, setTasks] = useState([]); // Store to-do list items
  const [selectedTime, setSelectedTime] = useState(null); // Store time slot being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for adding tasks
  const navigate = useNavigate();

  const handleAddReminderClick = (time) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  /// Fetch data when selectedDate changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await getTasksByDate(date);
        setTasks(tasksData.tasks || []);

        const remindersData = await getRemindersByDate(date);
        console.log("Reminders Data:", remindersData);
        // Ensure reminders is always an object with arrays
        const formattedReminders = remindersData.reminders || {};
        Object.keys(formattedReminders).forEach(time => {
          if (!Array.isArray(formattedReminders[time])) {
            formattedReminders[time] = [];
          }
        });
        setReminders(formattedReminders);
      } catch (error) {
        console.error("Error fetching data:", error);
        setReminders({});
      }
    };

    fetchData();
  }, [date]);

  const handleSaveReminder = async (text) => {
    try {
      const reminderData = { date, time: selectedTime, text };
      const response = await addReminder(reminderData);
      
      if (response && response.success) {
        // Refresh the reminders after adding
        const remindersData = await getRemindersByDate(date);
        setReminders(remindersData.reminders || {});
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
    setIsModalOpen(false);
  };

  const handleDeleteReminder = async (reminderID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reminder?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:5000/api/delete_reminder/${reminderID}`, {
        method: "DELETE",
      });
      setReminders(prev => {
        const newReminders = { ...prev };
        for (const time in newReminders) {
          newReminders[time] = newReminders[time].filter(rem => rem.id !== reminderID);
        }
        return newReminders;
      });
    } catch (error) {
      console.error("Error deleting reminder: ", error);
    }
  };

  const handleEditReminder = async (time, reminderIndex, reminderId) => {
    try {
      const currentReminder = reminders[time][reminderIndex];
      const newText = prompt("Edit reminder:", currentReminder.text);
      
      if (newText && newText.trim() && newText !== currentReminder.text) {
        console.log("Editing reminder:", { reminderId, newText }); // Debug log
        
        const response = await editReminder(reminderId, newText);
        console.log("Edit response:", response); // Debug log
        
        if (response && response.message === "Reminder updated successfully") {
          // Update local state immediately
          setReminders(prev => ({
            ...prev,
            [time]: prev[time].map((rem, idx) => 
              idx === reminderIndex ? { ...rem, text: newText } : rem
            )
          }));
        }
      }
    } catch (error) {
      console.error("Error editing reminder:", error);
      alert("Failed to edit reminder");
    }
  };

  const handleNextDay = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    navigate(`/dashboard/${nextDate.toISOString().split("T")[0]}`);
  };

  const handlePrevDay = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    navigate(`/dashboard/${prevDate.toISOString().split("T")[0]}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button onClick={handlePrevDay}>◀</button>
        <h2>📅 {date}</h2>
        <button onClick={handleNextDay}>▶</button>
      </div>

      {/* Time-Stamps Section */}
      <div className="time-stamps">
        {Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}:00` : `${i}:00`)).map((time) => (
          <div key={time} className="time-slot">
            <span>{time}</span>
            <div className="reminders-container">
              {Array.isArray(reminders[time]) && reminders[time].length > 0 ? (
                reminders[time].map((rem, idx) => (
                  <div key={`${time}-${idx}`} className="reminder">
                    <span className="reminder-text">{rem.text}</span>
                    <div className="reminder-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditReminder(time, idx, rem.id)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteReminder(rem.id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="no-reminder">No Reminder</span>
              )}
            </div>
            <button 
              className="add-reminder-btn" 
              onClick={() => handleAddReminderClick(time)}
            >
              + Add Reminder
            </button>
          </div>
        ))}
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReminder}
      />

      {/* To-Do List */}
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

const TaskList = ({ tasks, setTasks }) => {
  const { date } = useParams();

  const addTask = async () => {
    const taskText = prompt("Enter new task:");
    if (taskText) {
      try {
        const newTask = { text: taskText, due_date: date };
        const response = await apiAddTask(newTask);

        if (response) {
          setTasks([...tasks, { id: response.id, text: taskText, completed: false }]);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:5000/api/delete_task/${taskId}`, {
        method: "DELETE"
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newText = prompt("Edit task:", task.text);
    
    if (newText && newText.trim() && newText !== task.text) {
      try {
        await apiEditTask(taskId, newText);
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, text: newText } : t
        ));
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
  };

  return (
    <div className="todo-widget">
      <h3>To-Do List</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTaskCompletion(index)} 
            />
            <span>{task.text}</span>
            <div className="task-actions">
              <button onClick={() => handleEditTask(task.id)}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={addTask}>+ Add Task</button>
    </div>
  );
};

export default Dashboard;
