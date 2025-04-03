import React from 'react'
import './GetStarted.css'
import { Link } from 'react-router-dom'

const GetStarted = () => {
  return (
    <>
    <header id='get-started-header'>
        <div id='get-started-logo'>
            <h1>Campus<span>Hive</span></h1>
        </div>
        <div id='login-signup-container'>
            <Link className='btn signup-btn' to='/signup'>SignUp</Link>
            <Link className='btn login-btn' to='/login'>LogIn</Link>
        </div>
    </header>

    <main id='get-started-container'>
      <div className="get-started-info">
        <h1>Welcome To Campus<span>Hive</span></h1>
        <p>The All-In-One solution to all your problems within your campus !</p>
      </div>
      <div className="get-started-cards-container">
        <div className='get-started-box box-1'>
          <i className="ri-taxi-line"></i>
          <h3>Carpooling</h3>
          <p>Travelling expenses getting a little too high? Share rides with fellow students. Save money and reduce your carbon footprint.</p>
        </div>
        <div className='get-started-box box-2'>
          <i className="ri-search-line"></i>
          <h3>Lost & Found</h3>
          <p>Found something that might be somone's lost item? Report it here so the owner can find it.</p>
        </div>
        <div className='get-started-box box-3'>
          <i className="ri-roadster-fill"></i>
          <h3>Car Rental</h3>
          <p>Want to go for a ride? Rent cars from fellow students or local services at special campus rates.</p>
        </div>
        <div className='get-started-box box-4'>
          <i className="ri-briefcase-3-line"></i>
          <h3>Projects</h3>
          <p>Share projects, find collaborators, and join others to create something great - from coding to design to research.</p>
        </div>
        <div className='get-started-box box-5'>
          <i className="ri-chat-4-line"></i>
          <h3>Campus Chat</h3>
          <p>Chat with the entire campus community in real-time.</p>
        </div>
      </div>
    </main>
    </>
  )
}

export default GetStarted