import React, { useState, useEffect } from "react";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Load tasks from the database on component mount
  useEffect(() => {
    const fetchTasksFromDatabase = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_tasks");
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };

    fetchTasksFromDatabase();
  }, []);

  // Add task to database and update state
  const handleAddTask = async () => {
    if (taskInput.trim() === "") return;

    const newTask = { id: Date.now(), text: taskInput };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/add_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setTasks([...tasks, newTask]); // Update UI after successful DB insert
        setTaskInput("");
      }
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  // Delete task from database
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/delete_task/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId)); // Update UI
      }
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  return (
    <div className="tasks-container">
      <h2>Task Manager</h2>
      <div className="task-input">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={taskInput} 
          onChange={(e) => setTaskInput(e.target.value)} 
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.text}</span>
            <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
