import React, { useState } from 'react'
import './ReportLostItem.css'
import axios from 'axios'

const ReportLostItem = ({ setIsOpen, setLostItems }) => {

    const [previewURL, setPreviewURL] = useState(null);
    const [lostItemData, setLostItemData] = useState({
        itemName : "",
        itemDescription :"",
        itemImage : null,
        itemStatus: "Lost"
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setLostItemData(prev => ({
            ...prev, [name] : value
        }));
    }

    const fileChangeHandler = (e) => {
        const image = e.target.files[0];
        setLostItemData(prev => ({
            ...prev, itemImage : image
        }));
        setPreviewURL(URL.createObjectURL(image));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('itemName', lostItemData.itemName);
        formData.append('itemDescription', lostItemData.itemDescription);
        formData.append('itemImage', lostItemData.itemImage);
        formData.append('itemStatus', lostItemData.itemStatus);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/lostnfound`, 
                formData, 
                { withCredentials : true,
                headers : { 'Content-Type' : 'multipart/form-data' } 
            });
            setLostItems(prev => [...prev, response.data]);
            setIsOpen(false);
        } catch (err) {
            alert(err.response?.data.message || "Something went wrong");
        }
        
        setLostItemData({
            itemName : "",
            itemDescription :"",
            itemImage : null,
            itemStatus : "lost"
        });

        setPreviewURL(null);
    }

  return (
    <main id='lost-item-report'>
        <h2>Enter The Details Of The Lost / Found Item</h2>
        <form encType='multipart/form-data' onSubmit={submitHandler}>
            <input 
                type="text" 
                placeholder='Item Name' 
                name='itemName' 
                value={lostItemData.itemName} 
                onChange={changeHandler}
                required
            />
            <textarea 
                name="itemDescription"
                cols={60}
                rows={6}
                placeholder='Item Description'
                value={lostItemData.itemDescription}
                onChange={changeHandler}
                required
            />
            <div className="radio-group">
                <label>
                    <input 
                        type="radio" 
                        name="itemStatus" 
                        value="Lost" 
                        checked={lostItemData.itemStatus === "Lost"}
                        onChange={changeHandler}
                    />
                    Lost Item
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="itemStatus" 
                        value="Found" 
                        checked={lostItemData.itemStatus === "Found"}
                        onChange={changeHandler}
                    />
                    Found Item
                </label>
            </div>
            <div className="lost-item-image">
            <label>Upload Item Image : </label>
                <input type="file"
                    name='itemImage'
                    onChange={fileChangeHandler}
                    required
                />
            </div>
            { previewURL && <img src={previewURL} alt='preview' width='200' /> }
            <div className='lost-item-post-button'>
                <button>Post</button>
            </div>
        </form>
    </main>
  )
}

export default ReportLostItem