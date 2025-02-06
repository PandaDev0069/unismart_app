import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Dashboard from "./components/Dashboard";

function Home() {
  return <h2>Welcome to UniSmart!</h2>;
}


function Notes() {
  return <h2>Note-Taking System Coming Soon!</h2>;
}

function CodeEditor() {
  return <h2>AI-Powered Code Editor Coming Soon!</h2>;
}

function Wellness() {
  return <h2>Wellness & Productivity Tracker Coming Soon!</h2>;
}

function App() {
  return (
    <Router>
      <Navbar />  {/* Ensure this is present */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/dashboard/:date" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/code" element={<CodeEditor />} />
          <Route path="/wellness" element={<Wellness />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
