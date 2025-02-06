import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReminderModal from "./ReminderModal";
import { 
  getTasksByDate, 
  getTasksByFilters,
  getRemindersByDate, 
  addReminder, 
  addTask as apiAddTask,
  editReminder,
  editTask as apiEditTask,
  toggleTaskCompletion as apiToggleTaskCompletion
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
                <span className="no-reminder"></span>
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



// Add this sorting function before the TaskList component
const sortByPriority = (tasks) => {
  const priorityOrder = {
    'High': 1,
    'Medium': 2,
    'Low': 3
  };

  return tasks.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

const TaskList = ({ tasks, setTasks }) => {
  const { date } = useParams();
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const [filterPriority, setFilterPriority] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("");

  const applyFilters = async () => {
    try {
      const completedValue = filterCompleted === "Completed" ? true : 
                            filterCompleted === "Not Completed" ? false : 
                            undefined;
                            
      const tasksData = await getTasksByFilters({
        date,
        priority: filterPriority,
        completed: completedValue
      });
      setTasks(tasksData);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
  };

  // Update the addTask function
const addTask = async () => {
  const taskText = prompt("Enter new task:");
  if (!taskText) return;

  const priority = prompt("Set priority: High, Medium, or Low", "Medium");
  if (!["High", "Medium", "Low"].includes(priority)) {
    alert("Invalid priority. Defaulting to Medium.");
    return;
  }

  if (taskText) {
    try {
      const newTask = { text: taskText, due_date: date, priority };
      const response = await apiAddTask(newTask);

      if (response) {
        const newTasks = [...tasks, { 
          id: response.id, 
          text: taskText, 
          completed: false, 
          priority 
        }];
        setTasks(sortByPriority(newTasks));
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }
};

  const handleToggleCompletion = async (taskId) => {
    try {
      const data = await apiToggleTaskCompletion(taskId);
      if (data.success) {
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId 
              ? { ...task, completed: !task.completed }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
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

  const handleEditTask = async (taskId, currentPriority ) => {
    const task = tasks.find(t => t.id === taskId);
    const newText = prompt("Edit task:", task.text);
    
    const newPriority = prompt("Edit priority (High, Medium, Low):", currentPriority);
    if (!["High", "Medium", "Low"].includes(newPriority)) {
      alert("Invalid priority. Keeping previous value.");
      return;
    }


    if (newText && newText.trim() && newText !== task.text) {
      try {
        await apiEditTask(taskId, newText);
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...task, text: newText, priority: newPriority } : task
        ));
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
    setEditingTask(null);
  };

  const saveEdit = async (taskId) => {
    try {
      await apiEditTask(taskId, editText, editPriority);
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, text: editText, priority: editPriority }
          : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  return (
    <div className="todo-widget">
      <h3>To-Do List</h3>
      <div className="filter-controls">
        <select 
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select 
          value={filterCompleted}
          onChange={(e) => setFilterCompleted(e.target.value)}
        >
          <option value="">All Tasks</option>
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div className="task-left">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => handleToggleCompletion(task.id)} 
              />
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span>{task.text}</span>
              )}
            </div>
            
            <div className="task-right">
              {editingTask === task.id ? (
                <>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                </>
              ) : (
                <>
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <div className="task-actions">
                    <button onClick={() => startEditing(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
