import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About</h3>
          <p>We provide amazing services to make your life easier.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@example.com</p>
          <div className="footer-social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-nav">
        <a href="#">About Us</a>
        <a href="#">Contact Us</a>
        <a href="#">Privacy Policy</a>
      </div>

      <div className="footer-bottom">
        © 2025 Monasteries. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;