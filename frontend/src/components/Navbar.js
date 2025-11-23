import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">MovieMate</span>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/my-list"
              className={`navbar-link ${location.pathname === '/my-list' ? 'active' : ''}`}
            >
              My List
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/add"
              className={`navbar-link ${location.pathname === '/add' ? 'active' : ''}`}
            >
              Add Content
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

