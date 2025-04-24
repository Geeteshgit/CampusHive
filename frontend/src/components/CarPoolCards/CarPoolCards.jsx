import React from 'react'
import './CarPoolCards.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

const CarPoolCards = (props) => {

    const navigate = useNavigate();
    const clickHandler = (user) => {
        navigate(`/messages/${user}`);
    }
    const { user } = useAuth();

  return (
    <div id='carpool-cards'>
        <div className='carpool-user'>
            <i className="ri-taxi-line taxi-icon"></i>
            <h3>{props.username ? props.username : user?.username}</h3>
        </div>
        <div className='carpool-info'>
            <div className="carpool-details">
                <div className='carpool-data'>
                    <i className="ri-map-pin-user-line"></i>
                    <p>{props.pickup}</p>
                </div>
                <div className='carpool-data'>
                    <i className="ri-map-pin-line"></i>
                    <p>{props.destination}</p>
                </div>
                <div className='carpool-data'>
                    <i className="ri-time-line"></i>    
                    <p>{props.time}</p>
                </div>
                <div className='carpool-data'>
                    <i className="ri-user-line"></i>
                    <p>{props.people} Seats</p>
                </div>
            </div>
            <button onClick={() => clickHandler(props.user)}>Request Ride</button>
        </div>
    </div>
  )
}

export default CarPoolCards