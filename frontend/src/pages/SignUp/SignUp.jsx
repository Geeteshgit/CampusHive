import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import axios from "axios"
import './SignUp.css'
import { initSocket, connectSocket } from '../../socket'
import { useAuth } from '../../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev, [name] : value
    }));
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,
          signUpData, 
          { withCredentials : true });

        if(response.status === 201) {
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

    setSignUpData({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
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
        toast.info(`Welcome ${response.data.user.username} !`, {
          position: "top-right",
          autoClose: 1500,
          pauseOnHover: false,
          theme: "dark",
        });
        setUser(response.data.user);
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Google Signup Failed", {
        position: "top-right",
        autoClose: 1500,
        pauseOnHover: false,
        theme: "dark",
      });
    }
  }

  return (
    <main id='signup'>
        <div className='signup-container'>
            <h1>Campus<span>Hive</span></h1>
            <form onSubmit={submitHandler}>
                <h2>Create Account</h2>
                <p className='signup-text'>Enter your details to start using CampusHive</p>
                <label>Username</label>
                <input type="text"
                  placeholder='John'
                  name='username' 
                  value={signUpData.username}
                  onChange={changeHandler}
                  />
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder='name@example.com' 
                  name='email' 
                  value={signUpData.email}
                  onChange={changeHandler}
                  />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder='New Password' 
                  name='password' 
                  value={signUpData.password}
                  onChange={changeHandler}
                />
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder='Confirm Password' 
                  name='confirmPassword' 
                  value={signUpData.confirmPassword}
                  onChange={changeHandler}
                />
                <button>Create Account</button>
                <p className='google-or'>OR</p>
                <div className="google-signup">
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
                <div className="login-route">
                    <p>Already Have An Account?</p>
                    <Link to='/login'>Login</Link>
                </div>
           </form>
           <p className='copyrights'>&copy;2025 CampusHive. All rights reserved.</p>
        </div>
    </main>
  )
}

export default SignUp