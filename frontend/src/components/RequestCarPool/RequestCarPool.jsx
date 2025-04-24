import React, { useState } from 'react'
import axios from 'axios'
import './RequestCarPool.css'

const RequestCarPool = ({ setIsOpen, setRides }) => {

    const [carPoolData, setCarPoolData] = useState({
        pickupPoint : "",
        destinationPoint :"",
        pickupTime : "",
        requiredPeople : "",
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setCarPoolData(prev => ({
            ...prev, [name] : value
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/carpool`, 
                carPoolData, 
                { withCredentials : true });
            setRides(prev => [...prev, response.data]);
            setIsOpen(false);
        } catch (err) {
            alert(err.response?.data.message || "Something went wrong");
        }
        setCarPoolData({
            pickupPoint : "",
            destinationPoint :"",
            pickupTime : "",
            requiredPeople : "",
        });
    }

  return (
    <>
    <main id='carpool-request'>
        <h2>Offer A Carpool Ride</h2>
        <form onSubmit={submitHandler}>
            <div className='carpool-input-group'>
                <input 
                    type="text" 
                    placeholder='Pickup Point' 
                    name='pickupPoint' 
                    value={carPoolData.pickupPoint} 
                    onChange={changeHandler}
                />
                <input 
                    type="text" 
                    placeholder='Destination Point' 
                    name='destinationPoint' 
                    value={carPoolData.destinationPoint} 
                    onChange={changeHandler}
                />
            </div>
            <div className='carpool-input-group'>
                <input 
                    type="text" 
                    placeholder='Pickup Time' 
                    name='pickupTime' 
                    value={carPoolData.pickupTime} 
                    onChange={changeHandler}
                /> 
                <input 
                    type="number" 
                    placeholder='Seats Available' 
                    min={1} 
                    max={5}
                    name='requiredPeople'
                    value={carPoolData.requiredPeople} 
                    onChange={changeHandler}
                    />
            </div>
            <div className="carpool-button-container">
                <button>Post Ride</button>
            </div>
        </form>
    </main>
    </>
  )
}

export default RequestCarPool