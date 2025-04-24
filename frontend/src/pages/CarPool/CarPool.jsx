import React, { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import CarPoolCards from '../../components/CarPoolCards/CarPoolCards'
import RequestCarPool from '../../components/RequestCarPool/RequestCarPool'
import axios from 'axios'
import './CarPool.css'

const CarPool = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rides, setRides] = useState([]);

  const getAllCarpools = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/carpool`);
      setRides(response.data);
    } catch (err) {
        console.log(err.response?.data.message || "Something went wrong");
      }
  }

  useEffect(() => {
    getAllCarpools();
  }, [])

  const filteredRides = rides.filter(ride => {
    const query = searchQuery.toLowerCase();
    return (
      ride.destinationPoint?.toLowerCase().includes(query) ||
      ride.pickupPoint?.toLowerCase().includes(query) ||
      ride.pickupTime?.toLowerCase().includes(query)
    );
  });

  const sortedRides = [...filteredRides].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className='components-container'>
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <main id='carpool-rides'>
          <div id='carpool-header-container'>
            <h1>CarPool</h1>
            <button onClick={() => setIsOpen(isOpen ? false : true)}>
              {isOpen && <i className="ri-close-line"></i>}
              {!isOpen && <i className="ri-add-line"></i>}
              {isOpen ? "Cancel" : "Offer A Ride"}
            </button>
          </div>
          {isOpen && <RequestCarPool setIsOpen={setIsOpen} setRides={setRides} />}
          <h2>Available Rides</h2>
          <div className='carpool-search'>
            <i className="ri-search-line search"></i>
            <input
              type="text"
              placeholder='Search by destination, pickup or time...'
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value) }}
            />
          </div>
          <div id='carpool-container'>
            {sortedRides.map((ride) => {
              return <CarPoolCards
                key={ride._id}
                user={ride.user?._id}
                username={ride.user?.username}
                pickup={ride.pickupPoint}
                destination={ride.destinationPoint}
                time={ride.pickupTime}
                people={ride.requiredPeople}
              />
            })}
          </div>
        </main>
      </div>
    </>
  )
}

export default CarPool