import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
    return (
        <footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <h3>About</h3>
      <p>We provide amazing services to make your life easier.</p>
    </div>
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#">Blog</a></li>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Contact</h3>
      <p>Email: info@example.com</p>
      <div class="footer-social">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </div>

  <div class="footer-nav">
    <a href="#">About Us</a>
    <a href="#">Contact Us</a>
    <a href="#">Privacy Policy</a>
  </div>

  <div class="footer-bottom">
    © 2025 Monasteries. All rights reserved.
  </div>
</footer>

    );
};

export default Footer;