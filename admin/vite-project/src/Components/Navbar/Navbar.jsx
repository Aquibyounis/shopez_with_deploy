import React from 'react';
import "./Navbar.css";
import navlogo from "../../assets/logo.jpg"
import profilelogo from "../../assets/facebook.png";

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} alt='' className='nav-logo'/>
      <h1>Admin Page</h1>
      <i className="fa-solid fa-user"></i>
    </div>
  )
}

export default Navbar
