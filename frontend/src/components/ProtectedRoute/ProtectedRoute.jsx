import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Spinner.css'

const ProtectedRoute = () => {

    const { user, loading } = useAuth();

    if(loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        )
    }
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
