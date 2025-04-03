import React, { useState, useEffect, use } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import Contacts from '../../components/DirectMessages/Contacts'
import Chat from '../../components/DirectMessages/Chat'
import axios  from 'axios'
import { initSocket, connectSocket } from '../../socket'
import { useAuth } from "../../context/AuthContext";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const DirectMessages = () => {
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const { userId } = useParams();

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const socket = initSocket();
      connectSocket();

      socket.emit("join", currentUser._id);

      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.off("onlineUsers");
      };
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${VITE_API_URL}/api/user/${userId}`, {
            withCredentials: true,
          });
          setSelectedUser(response.data);
        } catch (err) {
          console.log(err.response?.data.message || "Something went wrong");
        }
      }
    };

    fetchSelectedUser();
  }, [userId]);

  return (
    <>
    <Header toggleSidebar={toggleSidebar} />
    <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <button className="hamburger" onClick={() => setContactsOpen(true)}>
          <i className="ri-arrow-right-wide-line"></i>
        </button>
        <Contacts 
          onSelectUser={setSelectedUser} 
          currentUser={currentUser} 
          onlineUsers = {onlineUsers} 
          selectedUser={selectedUser}
          contactsOpen = {contactsOpen}
          setContactsOpen = {setContactsOpen}
        />
        <Chat selectedUser={selectedUser} currentUser={currentUser} />
    </div>
    </>
  )
}

export default DirectMessages