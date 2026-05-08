import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

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
            <li><Link to="/monasteries">Blog</Link></li>
            <li><Link to="/contact">FAQs</Link></li>
            <li><Link to="/contact">Support</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: kaifiazam16@gmail.com</p>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/kaifee-azam/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <img src="/socialMediaIcon/linkedin.png" alt="LinkedIn" style={{ width: 24, height: 24 }} />
            </a>
            <a href="https://x.com/kaifiaz25589622" aria-label="X" target="_blank" rel="noopener noreferrer">
              <img src="/socialMediaIcon/twitter.png" alt="X" style={{ width: 24, height: 24 }} />
            </a>
            <a href="https://www.instagram.com/raj_.one8?igsh=YnQyYmd0ZjU2N3E2" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <img src="/socialMediaIcon/instagram.png" alt="Instagram" style={{ width: 24, height: 24 }} />
            </a>
          </div>
        </div>
      </div>



      <div className="footer-bottom">
        © 2025 Monasteries. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;