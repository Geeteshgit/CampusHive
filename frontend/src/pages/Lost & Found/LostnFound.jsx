import React, { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import LostnFoundCards from '../../components/LostnFoundCards/LostnFoundCards'
import ReportLostItem from '../../components/ReportLostItem/ReportLostItem'
import axios from 'axios'
import './LostnFound.css'

const LostnFound = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const getAllItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/lostnfound`);
      setLostItems(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getAllItems();
  }, [])


  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = lostItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(query) ||
      item.itemDescription.toLowerCase().includes(query)
    );
  })

  const sortedItems = [...filteredItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <main id='lostnfound'>
          <div id="lostnfound-header-container">
            <h1>Lost & Found</h1>
            <button onClick={() => { setIsOpen(isOpen ? false : true) }}>
              {isOpen && <i className="ri-close-line"></i>}
              {!isOpen && <i className="ri-edit-line"></i>}
              {isOpen ? 'Cancel' : 'Report An Item'}
            </button>
          </div>
          {isOpen && <ReportLostItem />}
          <h2>Lost / Found Items</h2>
          <div className="items-search">
            <i className="ri-search-line search"></i>
            <input
              type="text"
              placeholder='Search for lost items...'
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value) }}
            />
          </div>
          <div id='lostnfound-container'>
            {sortedItems.map((item) => {
              return <LostnFoundCards
                key={item._id}
                user={item.user?._id}
                item={item.itemName}
                description={item.itemDescription}
                image={item.itemImage}
                status={item.itemStatus}
                foundDate={new Date(item.createdAt).toLocaleDateString('en-GB')}
              />
            })}
          </div>
        </main>
      </div>
    </>
  )
}

export default LostnFound