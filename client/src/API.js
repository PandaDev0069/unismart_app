const BASE_URL = "http://127.0.0.1:5000/api";

export const getTasksByDate = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/get_tasks/${date}`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const getRemindersByDate = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/get_reminders/${date}`);
    if (!response.ok) throw new Error("Failed to fetch reminders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return { reminders: []};
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await fetch(`${BASE_URL}/add_task`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const addReminder = async (reminderData) => {
  try {
    const response = await fetch(`${BASE_URL}/add_reminder`,{
      method: "POST",
      headers: { "Content-Typer": "application/json" },
      body: JSON.stringify(reminderData),
    });
    if (!response.ok) throw new Error("Failed to add reminder");
    return await response.json();
  } catch (error) {
    console.error("Error adding reminder:", error);
  }
};