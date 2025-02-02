import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/message";

export const fetchMessage = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);  // Debugging
    return response.data.message;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "Error loading data";
  }
};
