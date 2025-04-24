import React, { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import CarRentalCards from '../../components/CarRentalCards/CarRentalCards'
import CarRentalUpload from '../../components/CarRentalUpload/CarRentalUpload'
import axios from 'axios'
import './CarRentals.css'

const CarRentals = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const [carRentals, setCarRentals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const getAllRentals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/carrental`);
      setCarRentals(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "something went wrong");
    }
  }

  useEffect(() => {
    getAllRentals();
  }, [])

  const sortedRentals = [...carRentals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="components-container">
        <SideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
        <main id='carrentals'>
          <div id="carrentals-header-container">
            <h1>Campus Car Rentals</h1>
            <button onClick={() => { setIsOpen(isOpen ? false : true) }}>
              {isOpen && <i className="ri-close-line"></i>}
              {!isOpen && <i className="ri-add-line"></i>}
              {isOpen ? 'Cancel' : 'Add Vehicle'}
            </button>
          </div>
          {isOpen && <CarRentalUpload setIsOpen={setIsOpen} setCarRentals={setCarRentals} />}
          <h2>Vehicles Available for Rent</h2>
          <div id='carrentals-container'>
            {sortedRentals.map((vehicle) => {
              return <CarRentalCards
                key={vehicle._id}
                user={vehicle.user?._id}
                username={vehicle.user?.username}
                image={vehicle.vehicleImage}
                model={vehicle.vehicleModel}
                description={vehicle.vehicleDescription}
                mileage={vehicle.vehicleMileage}
                rentalPeriod={vehicle.rentalPeriod}
                rentalAmount={vehicle.rentalAmount}
              />
            })}
          </div>
        </main>
      </div>
    </>
  )
}

export default CarRentals