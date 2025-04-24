import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './CarRentalsTab.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CarRentalsTab = () => {

  const [carRentalCards, setCarRentalCards] = useState([]);

  const getUserRentals = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/carrental/myrentals`, 
        { withCredentials : true });
      setCarRentalCards(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/carrental/${id}`, 
        { withCredentials : true });
      setCarRentalCards(prev => prev.filter(rental => rental._id !== id));
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getUserRentals();
  }, [])

  return (
    <div id='my-rental-tab'>
      <h2>Your Car Rentals</h2>
      <div className='my-rental-cards'>
        {carRentalCards.map(rental => {
          return <div id='my-rental-card' key={rental._id}>
              <div className='my-rental-card-container'>
                <div className='my-rental-image'>
                  <img 
                    src={`${VITE_API_URL}/uploads/${rental.vehicleImage}`} 
                    alt="vehicle-image" 
                    crossOrigin='anonymous'
                    onError={(e) => e.target.src ='./default.jpg'}  
                  />
                </div>
                <div className="my-rental-info">
                  <p>Vehicle Model : {rental.vehicleModel}</p>
                  <p>Vehicle Description : {rental.vehicleDescription}</p>
                  <p>Rental Amount : Rs.{rental.rentalAmount}</p>
                  <p>Rental Period : {rental.rentalPeriod}</p>
                  <p>Vehicle Mileage : {rental.vehicleMileage}</p>
                </div>
              </div>
              <button onClick={()=>deleteHandler(rental._id)}><i className="ri-delete-bin-line"></i></button>
          </div>
        })}
      </div>
    </div>
  )
}

export default CarRentalsTab