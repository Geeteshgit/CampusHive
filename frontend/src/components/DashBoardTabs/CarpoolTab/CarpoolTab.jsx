import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './CarpoolTab.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CarpoolTab = () => {

  const [carpoolCards, setCarpoolCards] = useState([]);

  const getCarpoolRides = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/carpool/rides`,
         { withCredentials : true });
      setCarpoolCards(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/carpool/${id}`,
        { withCredentials : true });
      setCarpoolCards(prev => prev.filter(ride => ride._id !== id));
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getCarpoolRides();
  }, [])

  return (
    <div id='carpool-tab'>
      <h2>Your Carpool Rides</h2>
      <div className='carpool-cards'>
        {carpoolCards.map(ride => {
          return <div id='ride-card' key={ride._id}>
              <div className='ride-card-details'>
                <i className="ri-map-pin-user-line"></i>
                <p>{ride.pickupPoint}</p>
              </div>
              <div className='ride-card-details'>
                <i className="ri-map-pin-line"></i>
                <p>{ride.destinationPoint}</p>
              </div>
              <div className='ride-card-details'>
                <i className="ri-time-line"></i>
                <p>{ride.pickupTime}</p>
              </div>
              <div className='ride-card-details'>
                <i className="ri-user-line"></i>
                <p>{ride.requiredPeople}</p>
              </div>
              <button onClick={()=>deleteHandler(ride._id)}><i className="ri-delete-bin-line"></i></button>
          </div>
        })}
      </div>
    </div>
  )
}

export default CarpoolTab