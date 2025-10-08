import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import CulturalCalendar from '../CulturalCalendar/CulturalCalendar';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <header className="header">
            <div className="nav">
                <Link to="/" className="logo" onClick={closeMenu}>Monastery360</Link>
                
                {/* Hamburger Menu Button */}
                <button 
                    className="menu-toggle" 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/monasteries" onClick={closeMenu}>Historic Places</Link></li>
                        <li><Link to="/cultural-calendar" onClick={closeMenu}>Cultural Calendar</Link></li>
                        <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
                        {!isAuthenticated ? (
                            <li><Link to="/login" onClick={closeMenu}>Login/Signup</Link></li>
                        ) : (
                            <>
                                <li><span className="welcome-text">Welcome, {user?.firstName || user?.email}</span></li>
                                <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;