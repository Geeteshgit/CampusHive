import React from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = ({ toggleSidebar }) => {

  const { user } = useAuth();

  return (
    <header id='header'>
      <div id='logo'>
        <i className="ri-menu-2-line" onClick={toggleSidebar} />
        <h1>Campus<span>Hive</span></h1>
      </div>
      <div id='header-container'>
          <NavLink to='/dashboard'>
            <div id='avatar'>
                <img src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePhoto}`} 
                  alt="profile-pic" 
                  crossOrigin="anonymous"
                />
            </div>
          </NavLink>
      </div>
    </header>
  )
}

export default Header