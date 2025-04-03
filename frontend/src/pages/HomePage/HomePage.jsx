import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import Discussions from '../../components/Discussions/Discussions'

const HomePage = () => {

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
    <Header toggleSidebar = {toggleSidebar} />
    <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <Discussions />
    </div>
    </>
  )
}

export default HomePage