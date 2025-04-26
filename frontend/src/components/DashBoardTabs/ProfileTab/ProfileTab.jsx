import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
import './ProfileTab.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProfileTab = () => {

    const navigate = useNavigate();

    useEffect(() => {
        getUserProfile();
    }, [])

    const getUserProfile = async () => {
        try {
            const response = await axios.get(`${VITE_API_URL}/api/user`, 
                { withCredentials: true });

            const { username, email, profilePhoto } = response.data;
            setProfileData(prev => ({
                ...prev,
                image: profilePhoto,
                username,
                email
            }));
        } catch (err) {
            console.log(err.response?.data.message || "Failed to fetch profile");
        }
    }

    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        image: null
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev, [name]: value
        }));
    }

    const fileChangeHandler = (e) => {
        const image = e.target.files[0];
        setProfileData(prev => ({
            ...prev, image: image,
            preview: URL.createObjectURL(image)
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const { username, email, oldPassword, newPassword, confirmPassword, image } = profileData;
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("oldPassword", oldPassword);
            formData.append("newPassword", newPassword);
            formData.append("confirmPassword", confirmPassword);
            if (image && typeof image !== 'string') {
                formData.append('image', image);
            }

            const response = await axios.put(`${VITE_API_URL}/api/user`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-type': 'multipart/form-data' }
                });
                toast.success('Profile Updated!', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                });
            getUserProfile();
        } catch (err) {
            toast.warn(`${err.response?.data.message || "Something went wrong"}`, {
                position: "top-right",
                autoClose: 2000,
                theme: "dark",
            });
        }
    }

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    const deleteHandler = async () => {
        setConfirmDelete(confirmDelete ? false : true);
        if (deleteInput === 'confirm') {
            try {
                await axios.delete(`${VITE_API_URL}/api/user`, { withCredentials: true });
                toast.error('Account deleted successfully!', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                });
                navigate('/');
            } catch (err) {
                toast.error(`${err.response?.data.message || "Something went wrong"}`, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "dark",
                });
            }
        } else {
            return;
        }
    }

    return (
        <div id='profile-tab'>
            <div className='profile-tab-header'>
                <div className="profile-tab-headings">
                    <h2>Profile Information</h2>
                    <p>Update your profile information</p>
                </div>
                <div className='profile-tab-delete'>
                    <button onClick={deleteHandler}>Delete Account</button>
                    {confirmDelete && <input
                        type='text'
                        placeholder='Type "confirm" to delete'
                        name='confirm-delete-input'
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                    />}
                </div>
            </div>
            <div className='profile-tab-container'>
                <form encType='multipart/form-data' onSubmit={submitHandler}>
                    <div className='profile-tab-profile-pic'>
                        <label htmlFor='profile-pic'>
                            {profileData.preview ? (
                                <img src={profileData.preview} 
                                    alt="profile-pic" 
                                    crossOrigin="anonymous" 
                                />
                            ) : profileData.image ? (
                                <img 
                                    src={`${profileData.image}`} 
                                    alt="profile-pic" 
                                    crossOrigin="anonymous"
                                    onError={(e) => e.target.src = './user.jpg'} 
                                />
                            ) : (
                                <img 
                                    src='./user.jpg' 
                                    alt="profile-image" 
                                    crossOrigin='anonymous'
                                />
                            )}
                        </label>
                        <input
                            type="file"
                            id='profile-pic'
                            name='image'
                            onChange={fileChangeHandler}
                        />
                    </div>
                    <div className='profile-tab-input-values'>
                        <label>Username</label>
                        <input
                            type="text"
                            name='username'
                            value={profileData.username || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className='profile-tab-input-values'>
                        <label>Email</label>
                        <input
                            type="email"
                            name='email'
                            value={profileData.email || ""}
                            onChange={changeHandler}
                            readOnly
                        />
                    </div>
                    <div className='profile-tab-input-values'>
                        <label>Old Password</label>
                        <input
                            type="password"
                            name='oldPassword'
                            value={profileData.oldPassword || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className='profile-tab-input-values'>
                        <label>New Password</label>
                        <input
                            type="password"
                            name='newPassword'
                            value={profileData.newPassword || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className='profile-tab-input-values'>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name='confirmPassword'
                            value={profileData.confirmPassword || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <button>Save Profile</button>
                </form>
            </div>
        </div>
    )
}

export default ProfileTab