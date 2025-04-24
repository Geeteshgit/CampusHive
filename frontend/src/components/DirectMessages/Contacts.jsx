import React, { useEffect, useState } from 'react';
import './Contacts.css'
import axios from 'axios'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Contacts = ({ onSelectUser, currentUser, onlineUsers, selectedUser, contactsOpen, setContactsOpen }) => {

  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/api/messages/conversations`, {
          withCredentials: true,
        });
        setConversations(response.data);
      } catch (err) {
        console.log(err.response?.data.message || "Something went wrong");
      }
    }

    if (currentUser) fetchConversations();
  }, [currentUser]);
  
  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants.find((p) => p._id !== currentUser?._id);
    return otherUser?.username.toLowerCase().includes(search.toLowerCase());
  });
  
  return (
    <aside id='contacts' className={`${contactsOpen ? "open" : "" }`}>
      <div className="contacts-header">
        <i className="ri-search-line search"></i>
        <input 
          type="text" 
          placeholder='Search Contacts...' 
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
      </div>
      <div className="contacts-container">
        {filteredConversations.map(conv => {
          const otherUser = conv.participants.find((p) => p._id !== currentUser?._id);
          const isOnline = onlineUsers.includes(otherUser?._id);
          const isSelected = selectedUser?._id === otherUser?._id;
          return (
            <div key={conv._id}
              className={`user-entry ${isSelected ? "active-user" : "" }`}
              onClick={() => {onSelectUser(otherUser); setContactsOpen(false)}}>
              <div className="user-image">
                {otherUser?.profilePhoto ? (
                  <img 
                    src={`${otherUser.profilePhoto}`}
                    alt="profile"
                    crossOrigin="anonymous"
                    onError={(e) => e.target.src = './user.jpg'}
                  />
                ) : (
                  <div>Image</div>
                )}
              </div>
              <div className='user-info'>
                  <h4>{otherUser?.username}</h4>
                  {isOnline && <span className="online-dot" />}
                  <p>{conv.lastMessage?.message || "Start a conversation!"}</p>
              </div>
              <div className='user-last-message-time'>
                <p>
                  {conv.lastMessage?.createdAt
                  ? new Date(conv.lastMessage.createdAt)
                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  )
}

export default Contacts