import React from 'react'
import './CarRentalCards.css'
import { useNavigate } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const CarRentalCards = (props) => {

    const navigate = useNavigate();
    const clickHandler = (user) => {
        navigate(`/messages/${user}`);
    }

  return (
    <div id='carrental-card' onClick={() => clickHandler(props.user)}>
        <div className='carrental-car-image'>
            <img src={`${VITE_API_URL}/uploads/${props.image}`} 
                alt="car-image" 
                crossOrigin='anonymous'
            />
        </div>
        <div className='carrental-car-info'>
            <div className="carrental-car-details">
                <div className='carrental-vehicle'>
                    <h3>{props.model}</h3>
                    <p>Rs.{props.rentalAmount}</p>
                </div>
                <p>{props.description}</p>
                <div className='carrental-rental-details'>
                    <div className='carrental-rental-details'>
                        <span>Available : </span>
                        <p>{props.rentalPeriod}</p>
                    </div>
                    <div className='carrental-rental-details'>
                        <span>Mileage : </span>
                        <p>{props.mileage}</p>
                    </div>
                </div>
                <span className='carrental-contact'>Contact Owner</span>
            </div>
        </div>
    </div>
  )
}

export default CarRentalCards