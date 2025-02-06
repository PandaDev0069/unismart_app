import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#121212" }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="UniSmart Logo" className="logo" />
          <span className="ms-2">UniSmart</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="nav-buttons">
            <Link className="btn btn-dark" to="/calendar">Calendar</Link>             
            <Link className="btn btn-dark" to="/notes">Notes</Link>
            <Link className="btn btn-dark" to="/files">Files</Link>
            <Link className="btn btn-dark" to="/code">Code Editor</Link>
            <Link className="btn btn-dark" to="/wellness">Wellness</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
