import React, { useState, useEffect, use} from "react";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from sessionStorage when the page loads
    const savedTasks = sessionStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
    });


  const [taskInput, setTaskInput] = useState("");

  // Save tasks to sessionStorage whenever tasks change
  useEffect(() => {
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: taskInput }]);
    setTaskInput("");
  };

  const handleDeleteTask = async (taskId) => {
    // Remove from UI
    setTasks(tasks.filter(task => task.id !== taskId));

    // Send request to Flask to delete task from database
    try {
      await fetch(`http://127.0.0.1:5000/api/delete_task/${taskId}`, {
        method: "DELETE",
      });
      console.log(`Task ${taskId} deleted from database`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // function to send tasks to Flask when session ends
  const saveTasksToDatabase = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/save_tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // 🔹 Make sure it's sending JSON
          "Accept": "application/json"
        },
        body: JSON.stringify({ tasks }),
      });
  
      const data = await response.json();
      console.log("✅ Save response:", data);
    } catch (error) {
      console.error("❌ Error saving tasks:", error);
    }
  };
  

  // Listen for session ending (tab close or page refresh)
  useEffect(() => {
    window.addEventListener("beforeunload", saveTasksToDatabase);
    return () => {
        window.removeEventListener("beforeunload", saveTasksToDatabase);
    };
  }, [tasks]);

  useEffect(() => {
    const fetchTasksFromDatabase = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_tasks");
        const text = await response.text(); // Get raw response text
        console.log("🔍 Raw API Response:", text); // Debugging log
  
        const data = JSON.parse(text); // Convert to JSON
        setTasks(data.tasks);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };
  
    fetchTasksFromDatabase();
  }, []);
  
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
