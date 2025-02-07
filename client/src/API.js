const BASE_URL = "https://a472-126-66-235-233.ngrok-free.app/api";

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

export const getTasksByFilters = async ({ date, priority, completed }) => {
  try {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (priority) params.append("priority", priority);
    if (completed !== undefined) params.append("completed", completed ? "1" : "0");

    const response = await fetch(`${BASE_URL}/get_tasks?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
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

export const editTask = async (taskId, newText, newPriority) => {
  try {
    const response = await fetch(`${BASE_URL}/edit_task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText, priority: newPriority }),
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

export const toggleTaskCompletion = async (taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/update_task/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Failed to toggle task');
    return data;
  } catch (error) {
    console.error('Error toggling task:', error);
    throw error;
  }
};

export const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get_notes`);
    if (!response.ok) throw new Error("Failed to fetch notes");
    return await response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { notes: [] };
  }
};

export const addNote = async (noteData) => {
  try {
    const response = await fetch(`${BASE_URL}/add_note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error("Failed to add note");
    return await response.json();
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

export const editNote = async (noteId, noteData) => {
  try {
    const response = await fetch(`${BASE_URL}/edit_note/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error("Failed to edit note");
    return await response.json();
  } catch (error) {
    console.error("Error editing note:", error);
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/delete_note/${noteId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete note");
    return await response.json();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

export const uploadFile = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/upload_file`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload file");
    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};


export const getFiles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get_files`);
    if (!response.ok) throw new Error("Failed to fetch files");
    return await response.json();
  } catch (error) {
    console.error("Error fetching files:", error);
    return { files: [] };
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/delete_files/${fileId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete file");
    return await response.json();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};