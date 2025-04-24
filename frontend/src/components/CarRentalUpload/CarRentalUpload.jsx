import React, { useState } from 'react'
import './CarRentalUpload.css'
import axios from 'axios'

const CarRentalUpload = ({ setIsOpen, setCarRentals }) => {

    const [previewURL, setPreviewURL] = useState(null);

    const [vehicleData, setVehicleData] = useState({
        vehicleModel : "",
        vehicleDescription :"",
        rentalPeriod : "",
        rentalAmount : "",
        vehicleMileage : "",
        vehicleImage : null
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setVehicleData(prev => ({
            ...prev, [name] : value
        }));
    }

    const fileChangeHandler = (e) => {
        const image = e.target.files[0];
        setVehicleData(prev => ({
            ...prev, vehicleImage : image
        }));
        setPreviewURL(URL.createObjectURL(image));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('vehicleModel', vehicleData.vehicleModel);
        formData.append('vehicleDescription', vehicleData.vehicleDescription);
        formData.append('rentalPeriod', vehicleData.rentalPeriod);
        formData.append('rentalAmount', vehicleData.rentalAmount);
        formData.append('vehicleMileage', vehicleData.vehicleMileage);
        formData.append('vehicleImage', vehicleData.vehicleImage);

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/carrental`,
                formData, 
                { withCredentials : true,
                    headers : { 'Content-Type' : 'multipart/form-data' }     
            });
            setCarRentals(prev => [...prev, response.data]);
            setIsOpen(false);
        } catch (err) {
            alert(err.response?.data.message || "Something went wrong");
        }
        
        setVehicleData({
            vehicleModel : "",
            vehicleDescription :"",
            rentalPeriod : "",
            rentalAmount : "",
            vehicleMileage : "",
            vehicleImage : null
        });

        setPreviewURL(null);
    }

  return (
    <main id='carrental-upload'>
        <form encType='multipart/form-data' onSubmit={submitHandler}>
            <h2>Enter The Details Of Your Car</h2>
            <div className='rental-upload-field'>
                <input 
                    type="text" 
                    placeholder='Vehicle Model' 
                    name='vehicleModel' 
                    value={vehicleData.vehicleModel} 
                    onChange={changeHandler}
                    required
                />
                <input 
                    type="text" 
                    placeholder='Rental Amount' 
                    name='rentalAmount' 
                    value={vehicleData.rentalAmount} 
                    onChange={changeHandler}
                    required
                />
            </div>
            <div className='rental-upload-field'>
                <input 
                    type="text" 
                    placeholder='Rental Period' 
                    name='rentalPeriod' 
                    value={vehicleData.rentalPeriod} 
                    onChange={changeHandler}
                    required
                />
                <input 
                    type="text" 
                    placeholder='Vehicle Mileage' 
                    name='vehicleMileage' 
                    value={vehicleData.vehicleMileage} 
                    onChange={changeHandler}
                    required
                />
            </div>
            <textarea 
                name="vehicleDescription"
                cols={60}
                rows={4}
                placeholder='Vehicle Description'
                value={vehicleData.vehicleDescription}
                onChange={changeHandler}
                required
            />
            <div className="carrental-upload-image">
            <label>Upload Image : </label>
                <input type="file"
                    name='vehicleImage'
                    onChange={fileChangeHandler}
                    required
                />
            </div>
            { previewURL && <img src={previewURL} alt='preview' width='200' /> }
            <div className='carrental-upload-button'>
                <button>Post Rental</button>
            </div>
        </form>
    </main>
  )
}

export default CarRentalUpload