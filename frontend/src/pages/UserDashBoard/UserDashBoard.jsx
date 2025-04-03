import React, { useState } from 'react'
import './UserDashBoard.css'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import ProfileTab from '../../components/DashBoardTabs/ProfileTab/ProfileTab'
import CarpoolsTab from '../../components/DashBoardTabs/CarpoolTab/CarpoolTab'
import LostnFoundTab from '../../components/DashBoardTabs/LostnFoundTab/LostnFoundTab'
import ProjectsTab from '../../components/DashBoardTabs/ProjectsTab/ProjectsTab'
import CarRentalsTab from '../../components/DashBoardTabs/CarRentalsTab/CarRentalsTab'


const UserDashBoard = () => {

    const [showSidebar, setShowSidebar] = useState(false);
      
    const toggleSidebar = () => {
        setShowSidebar(prev => !prev);
    };
    
    const [activeTab, setActiveTab] = useState('profile');

  return (
    <>
    <Header  toggleSidebar={toggleSidebar}/>
    <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <main id='dashboard'>
            <h1>Dashboard</h1>
            <p>Manage Your Account and Profile</p>
            <div className='dashboard-tabs-container'>
                <button
                    className={activeTab === 'profile' ? 'active' : ""}
                    onClick={() => setActiveTab('profile')}>
                    <i className="ri-user-line"></i>Profile
                </button>
                <button 
                    className={activeTab === 'carpools' ? 'active' : ""} 
                    onClick={() => setActiveTab('carpools')}>
                    <i className="ri-taxi-line"></i>Carpools
                </button>
                <button 
                    className={activeTab === 'lostnfound' ? 'active' : ""}
                    onClick={() => setActiveTab('lostnfound')}>
                    <i className="ri-search-line"></i>Lost & Found
                </button>
                <button 
                    className={activeTab === 'projects' ? 'active' : ""}
                    onClick={() => setActiveTab('projects')}>
                    <i className="ri-briefcase-3-line"></i>Projects
                </button>
                <button 
                    className={activeTab === 'carrentals' ? 'active' : ""}
                    onClick={() => setActiveTab('carrentals')}>
                    <i className="ri-roadster-line"></i>Car Rentals
                </button>
            </div>
            <div className='dashboard-active-tab'>
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'carpools' && <CarpoolsTab />}
                {activeTab === 'lostnfound' && <LostnFoundTab />}
                {activeTab === 'projects' && <ProjectsTab />}
                {activeTab === 'carrentals' && <CarRentalsTab />}
            </div>
        </main>
    </div>
    </>
  )
}

export default UserDashBoard