# UniSmart

**UniSmart** is an AI-powered university assistant designed to enhance student productivity by integrating task management, note-taking, coding assistance, and wellness tracking into a single platform.

## Table of Contents

- [About the Project](#about-the-project)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

UniSmart aims to provide students with a centralized tool to manage their academic and personal tasks efficiently. Key features include:

- **Task Management:** Create, edit, and delete tasks with deadlines.
- **Note-Taking:** Write and edit notes with Markdown support.
- **AI Study Assistant:** Generate lecture summaries and engage in Q&A.
- **Coding Space:** Write, run, and debug code with AI-powered assistance.
- **Wellness Tracker:** Monitor study habits and receive productivity tips.

## Project Structure

```bash
/unismart-app
├── /client            # React frontend
│   ├── /src
│   │   ├── /components # React components
│   │   ├── /pages      # Application pages
│   │   ├── App.js      # Main React component
│   │   ├── index.js    # Entry point
├── /server            # Flask backend
│   ├── /static        # Static assets (CSS, images)
│   ├── /templates     # HTML templates
│   ├── /models        # Database models
│   ├── /routes        # API endpoints
│   ├── /ai            # AI integrations
│   ├── app.py         # Main Flask application
│   ├── config.py      # Configuration settings
└── README.md          # Project documentation
