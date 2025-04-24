import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios'
import { initSocket, connectSocket } from '../../socket'
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
        loginData, 
        { withCredentials : true });
        
      if(response.status === 200) {
        initSocket();
        connectSocket();
        const user = response.data.user;
        setUser(user);
        toast.info(`Welcome ${user.username}!`, {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        navigate('/home');
      }  
    } catch (err) {
      toast.warn(`${err.response?.data.message || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
    setLoginData({
      email: "",
      password: ""
    });
  }

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        toast.info(`Welcome Back ${response.data.user.username} !`, {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
          theme: "dark",
        });
        setUser(response.data.user);
        navigate("/home");
      }
    } catch (err) {
      toast.warn(`${err.response?.data.message || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  }

  return (
    <main id='login'>
      <div className='login-container'>
        <h1>Campus<span>Hive</span></h1>
        <form action="/login" onSubmit={submitHandler}>
          <h2>Sign In</h2>
          <p className='login-text'>Enter your credentials to access CampusHive</p>
          <label>Email</label>
          <input 
            type="email" 
            placeholder='Your Email Address' 
            name='email' 
            value={loginData.email}
            onChange={changeHandler}
          />
          <label>Password</label>
          <input 
            type="password" 
            placeholder='Your Password' 
            name='password' 
            value={loginData.password}
            onChange={changeHandler}
          />
          <button>Login</button>
          <p className='google-or'>OR</p>
          <div className="google-or-login">
            <GoogleLogin
              onSuccess={credentialResponse => {
                handleGoogleSignup(credentialResponse);
              }}
              onError={() => {
                toast.warn(`${err.response?.data.message || "Something went wrong"}`, {
                  position: "top-right",
                  autoClose: 2000,
                  theme: "dark",
                });
              }}
              />
            </div>
          <div className="signup-route">
            <p>Don't have an account?</p>
            <Link to='/signup'>Create One</Link>
          </div>
        </form>
        <p className='copyrights'>&copy;2025 CampusHive. All rights reserved.</p>
      </div>
    </main>
  );
};

export default Login;
