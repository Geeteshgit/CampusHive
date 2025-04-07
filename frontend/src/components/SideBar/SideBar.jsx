import React from 'react'
import './SideBar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { disconnectSocket } from "../../socket";
import { useAuth } from '../../context/AuthContext'; 

const SideBar = ({ showSidebar, toggleSidebar }) => {

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const logoutHandler = async () => {
    try { 
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,
         {} , { withCredentials : true });
      if(response.status === 200) {
        disconnectSocket();
        setUser(null);
        navigate('/');
      } 
    } catch (err) {
      alert(err.response?.data.message || "Something went wrong!")
    }
  }

  return (
    <aside id='aside' className={showSidebar ? "open" : ""}>
        <i className="ri-close-large-line close" onClick={toggleSidebar}></i>
        <div className='main-routes-container'>
          <h3>MAIN MENU</h3>
          <NavLink to='/home' className={({isActive}) => isActive ? "active" : ""}><i className="ri-home-2-line"></i>Home</NavLink>
          <NavLink to='/messages' className={({isActive}) => isActive ? "active" : ""}><i className="ri-chat-4-line"></i>Chat</NavLink>
          <NavLink to='/carpool' className={({isActive}) => isActive ? "active" : ""}><i className="ri-taxi-line"></i>CarPool</NavLink>
          <NavLink to='/lostnfound' className={({isActive}) => isActive ? "active" : ""}><i className="ri-search-line"></i>Lost & Found</NavLink>
          <NavLink to='/projects' className={({isActive}) => isActive ? "active" : ""}><i className="ri-briefcase-3-line"></i>Projects</NavLink>
          <NavLink to='/carrentals' className={({isActive}) => isActive ? "active" : ""}><i className="ri-roadster-line"></i>Car Rentals</NavLink>
        </div>
        <div className='logout-container'>
          <button onClick={logoutHandler}><i className="ri-logout-box-line"></i>Logout</button>
        </div>
    </aside>
  )
}

export default SideBar