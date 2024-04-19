import React from 'react';
import '../style/Header.css';
import logo from '../style/images/logo-color.png'; // Import the SVG as a static file

const Header = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo" /> {/* Use the SVG as the src of an img tag */}
      <h3>Scheduler App</h3>
      <h3>By Dan's Mahoneys</h3>
    </div>
  );
}

export default Header;