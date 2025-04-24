import React from 'react'
import './LostnFoundCards.css'
import { useNavigate } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const LostnFoundCards = (props) => {

    const navigate = useNavigate();
    const clickHandler = (user) => {
        navigate(`/messages/${user}`);
    }

  return (
    <div id='lostnfound-card'>
        <div className='lostnfound-item-image'>
            <img 
                src={`${VITE_API_URL}/uploads/${props.image}`} 
                alt="found-item" 
                crossOrigin='anonymous'
                onError={(e) => e.target.src = './default.jpg'}
            />
        </div>
        <div className='lostnfound-item-info'>
            <div className="lostnfound-item-details">
                <div className='lostnfound-item'>
                    <h3>{props.item}</h3>
                    <h4 className={props.status === 'Lost' ? "lost" : "found"}>{props.status}</h4>
                </div>
                <p>{props.description}</p>
                <div className='lostnfound-item-date'>
                    <span>Reported On :</span>
                    <p>{props.foundDate}</p>
                </div>
                <button onClick={() => clickHandler(props.user)}>Contact</button>
            </div>
        </div>
    </div>
  )
}

export default LostnFoundCards