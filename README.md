# UniSmart

UniSmart is an AI-powered university assistant designed to enhance student productivity and well-being. It integrates task management, note-taking, code execution, and wellness tracking into a unified platform.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Dashboard**: Centralized hub with date navigation and time-stamped reminders.
- **Task Management**: To-do list widget with add, edit, and delete functionalities.
- **Reminder System**: Schedule and manage reminders with a user-friendly interface.
- **Note-Taking**: Markdown-supported note editor for efficient note management.
- **Code Execution**: Integrated code editor supporting Python and JavaScript execution.
- **Wellness Tracker**: Pomodoro timer and habit tracking to promote productivity and well-being.

## Project Structure

```bash
unismart_app/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable React components
│       ├── pages/          # Page components
│       ├── services/       # API service handlers
│       ├── App.js          # Main React component
│       └── index.js        # React entry point
├── server/                 # Flask backend
│   ├── ai/                 # AI integrations (e.g., summaries, Q&A)
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── static/             # Static files (CSS, images)
│   ├── templates/          # HTML templates (if needed)
│   ├── app.py              # Main Flask application
│   └── config.py           # Configuration settings
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
└── requirements.txt        # Python dependencies
```

## Technologies Used

- **Frontend**:
  - React
  - Tailwind CSS
- **Backend**:
  - Flask
  - SQLite (for development)
- **AI Integrations**:
  - OpenAI API
- **Code Execution**:
  - Pyodide (for Python)
  - Node.js (for JavaScript)

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Python 3.x installed
- Git installed

### Frontend Setup

1. **Navigate to the client directory**:
   ```bash
   cd unismart_app/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:3000`.

### Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd unismart_app/server
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables** (for development):
   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```

5. **Initialize the database**:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. **Start the Flask development server**:
   ```bash
   flask run
   ```

   The backend API will be accessible at `http://localhost:5000`.

## Usage

1. **Access the Dashboard**: View your tasks, reminders, and notes in a centralized location.
2. **Manage Tasks**: Add, edit, and delete tasks with deadlines.
3. **Set Reminders**: Schedule reminders with specific dates and times.
4. **Take Notes**: Create and edit notes using the integrated Markdown editor.
5. **Execute Code**: Write and run Python and JavaScript code within the platform.
6. **Track Wellness**: Use the Pomodoro timer and habit tracker to maintain productivity.

## Contributing

We welcome contributions to enhance UniSmart. Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a pull request**.

Please ensure your code adheres to our coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or support, please contact us at [ashispanta100@gmail.com](mailto:ashispanta100@gmail.com).
```

This `README.md` provides a comprehensive overview of the UniSmart project, including its features, structure, setup instructions, and contribution guidelines. It reflects the current state of the project as per the information provided. 
