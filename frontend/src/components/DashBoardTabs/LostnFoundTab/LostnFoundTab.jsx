import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './LostnFoundTab.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const LostnFoundTab = () => {

  const [foundItemCards, setFoundItemsCards] = useState([]);

  const getUserItems = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/lostnfound/myitems`, 
        { withCredentials : true });
      setFoundItemsCards(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/lostnfound/${id}`, 
        { withCredentials : true });
      setFoundItemsCards(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    getUserItems();
  }, [])

  return (
    <div id='my-found-item-tab'>
      <h2>Your Lost / Found Items</h2>
      <div className='my-found-item-cards'>
        {foundItemCards.map(item => {
          return <div id='my-found-item-card' key={item._id}>
              <div className='my-found-item-card-container'>
                <div className='my-item-image'>
                  <img 
                    src={`${VITE_API_URL}/uploads/${item.itemImage}`} 
                    alt="item-image" 
                    crossOrigin='anonymous'
                    onError={(e) => e.target.src ='./default.jpg'}  
                  />
                </div>
                <div className="my-item-info">
                  <p>Item Name : {item.itemName}</p>
                  <p>Item Description : {item.itemDescription}</p>
                </div>
              </div>
              <button onClick={()=>deleteHandler(item._id)}><i className="ri-delete-bin-line"></i></button>
          </div>
        })}
      </div>
    </div>
  )
}

export default LostnFoundTab