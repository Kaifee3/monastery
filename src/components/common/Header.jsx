import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import CulturalCalendar from '../CulturalCalendar/CulturalCalendar';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();

    useEffect(() => {
        console.log("Header - isAuthenticated:", isAuthenticated);
        console.log("Header - user data:", user);
        console.log("Header - user role:", user?.role);
    }, [isAuthenticated, user]);

    useEffect(() => {
        // Prevent body scroll when menu is open on mobile
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [isMenuOpen]);

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
            <div className="nav glass-nav">
                <Link to="/" className="logo animated-gradient" onClick={closeMenu}>Monastery360</Link>
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
                                <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
                                {user?.role === 'admin' && (
                                    <li><Link to="/admin" onClick={closeMenu} className="admin-link">Admin Panel</Link></li>
                                )}
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;