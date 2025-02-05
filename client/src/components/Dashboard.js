import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReminderModal from "./ReminderModal";
import { getTasksByDate, getRemindersByDate, addReminder, addTask as apiAddTask } from '../API'; // Import the functions
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
        setTasks(tasksData.tasks);

        const remindersData = await getRemindersByDate(date);
        console.log("Reminders Data:", remindersData);
        setReminders(remindersData.reminders || {});
        console.log("Fetched reminders:", remindersData.reminders); // Debugging
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [date]);

  const handleSaveReminder = async (text) => {
    try {
      const reminderData = { date, time: selectedTime, text };
      await addReminder(reminderData); // Send to API
      
      setReminders(prev => ({
        ...prev,
        [selectedTime]: [...(prev[selectedTime] || []), { text }],
      }));
    } catch (error) {
      console.error("Error saving reminder:", error);
    }
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

            {Array.isArray(reminders[time]) && reminders[time].length > 0 ? (
              reminders[time].map((rem, idx) => (
                <div key={idx} className="reminder">{rem.text}</div>
              ))
            ) : (
              <span className="no-reminder">No Reminder</span>
            )}

            <button className="add-reminder-btn" onClick={() => handleAddReminderClick(time)}>
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

  return (
    <div className="todo-widget">
      <h3>To-Do List</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} />
            {task.text}
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
      <button onClick={addTask}>+ Add Task</button>
    </div>
  );
};

export default Dashboard;
