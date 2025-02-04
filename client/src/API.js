const BASE_URL = "http://127.0.0.1:5000/api";

export const getTasksByDate = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/get_tasks/${date}`);
    if (!response.ok) throw new Error("Failed to fetch tasks");

    const data = await response.json();
    console.log("Fetched Reminders: ", data);

    return data || { reminders: {} };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
};

export const getRemindersByDate = async (date) => {
  try {
    const response = await fetch(`${BASE_URL}/get_reminders/${date}`);
    if (!response.ok) throw new Error("Failed to fetch reminders");
    const data = await response.json();
    console.log("Raw reminders data:", data); // Debug log
    return {
      reminders: data.reminders || {}
    };
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return { reminders: {} };
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await fetch(`${BASE_URL}/add_task`, {
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
    const response = await fetch(`${BASE_URL}/add_reminder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminderData),
    });
    if (!response.ok) throw new Error("Failed to add reminder");
    return await response.json();
  } catch (error) {
    console.error("Error adding reminder:", error);
  }
};

export const editTask = async (taskId, newText) => {
  try {
    const response = await fetch(`${BASE_URL}/edit_task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    if (!response.ok) throw new Error("Failed to edit task");
    return await response.json();
  } catch (error) {
    console.error("Error editing task:", error);
  }
};

export const editReminder = async (reminderId, text) => {
  try {
    const response = await fetch(`${BASE_URL}/edit_reminder/${reminderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    console.log("Edit reminder response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error editing reminder:", error);
    throw error;
  }
};