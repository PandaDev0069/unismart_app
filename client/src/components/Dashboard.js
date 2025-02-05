import React, { useEffect, useState } from "react";
import { getTasksByDate, getRemindersByDate } from "../API";
import { useParams, useNavigate } from "react-router-dom";
import ReminderModal from "./ReminderModal";
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
  useEffect(() =>{
    const fetchData = async () => {
      const tasksData = await getTasksByDate(date);
      const remindersData = await getRemindersByDate(date);

      setTasks(tasksData.tasks || []);
      setReminders(remindersData.reminders || []);
    }
    fetchData();
  }, [date]);


  const handleSaveReminder = (text) => {
    setReminders((prev) => ({
      ...prev,
      [selectedTime]: [...(prev[selectedTime] || []), text],
    }));
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
        {Array.from({ length: 24 }, (_, i) => `${i}:00`).map((time) => (
          <div key={time} className="time-slot">
            <span>{time}</span>
            {reminders[time]?.map((rem, idx) => (
              <div key={idx} className="reminder">{rem}</div>
            ))}
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

const TaskList = ({ tasks , setTasks }) => {
    const addTask = () => {
      const taskText = prompt("Enter new task:");
      if (taskText) {
        setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
      }
    };
  
    const toggleTaskCompletion = (index) => {
      setTasks((prev) =>
        prev.map((task, i) =>
          i === index ? { ...task, completed: !task.completed } : task
        )
      );
    };
  
    const deleteTask = (index) => {
      setTasks((prev) => prev.filter((_, i) => i !== index));
    };
  
    return (
      <div className="todo-widget">
        <h3>To-Do List</h3>
        <ul>
          {tasks.map((task, index) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} />
              {task.text}
              <button onClick={() => deleteTask(index)}>❌</button>
            </li>
          ))}
        </ul>
        <button onClick={addTask}>+ Add Task</button>
      </div>
    );
};


export default Dashboard;
