import React, { createContext, useEffect, useState, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const getUser  = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`, { withCredentials: true });
            setUser(response.data.user); 
            setLoading(false);
        } catch (err) {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
      }
      getUser();
    }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
