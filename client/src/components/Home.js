import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [imageError, setImageError] = useState({});

  const handleImageError = (imageName) => {
    setImageError(prev => ({...prev, [imageName]: true}));
  };

  const images = {
    hero: "/assets/ai-brain.png",
    taskManagement: "/assets/task-management.png",
    noteTaking: "/assets/note-taking.png",
    codingAssistance: "/assets/coding-assistance.png"
  };

  return (
    <div className="homepage-container">
      <header className="hero-section">
        <h1>UniSmart</h1>
        <p>Your Smartest Study Companion</p>
        {!imageError.hero && (
          <img 
            src={images.hero} 
            alt="AI Brain" 
            className="hero-image"
            onError={() => handleImageError('hero')}
          />
        )}
        <div className="cta-buttons">
          <Link to="/dashboard" className="btn">Get Started</Link>
          <Link to="/about" className="btn-secondary">Learn More</Link>
        </div>
      </header>
      
      <section className="features-section">
        <div className="feature">
          {!imageError.taskManagement && (
            <img 
              src={images.taskManagement} 
              alt="Task Management"
              onError={() => handleImageError('taskManagement')}
            />
          )}
          <h3>Task & Time Management</h3>
          <p>Keep track of assignments, deadlines, and reminders effortlessly.</p>
        </div>
        <div className="feature">
          {!imageError.noteTaking && (
            <img 
              src={images.noteTaking} 
              alt="Note Taking"
              onError={() => handleImageError('noteTaking')}
            />
          )}
          <h3>Smart Note-Taking</h3>
          <p>Organize your notes with AI-powered summarization.</p>
        </div>
        <div className="feature">
          {!imageError.codingAssistance && (
            <img 
              src={images.codingAssistance} 
              alt="Coding Assistance"
              onError={() => handleImageError('codingAssistance')}
            />
          )}
          <h3>AI Coding Assistance</h3>
          <p>Write, debug, and optimize code with AI-powered insights.</p>
        </div>
        <div className="feature">
          <img src="/assets/wellness-tracker.png" alt="Wellness Tracking" />
          <h3>Wellness & Productivity</h3>
          <p>Stay healthy with a built-in Pomodoro timer and habit tracker.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
