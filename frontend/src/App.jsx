import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import GetStarted from './pages/GetStarted/GetStarted'
import HomePage from './pages/HomePage/HomePage'
import CarPool from './pages/CarPool/CarPool'
import LostnFound from './pages/Lost & Found/LostnFound'
import Projects from './pages/ProjectsFinder/Projects'
import CarRentals from './pages/CarRentals/CarRentals'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import DirectMessages from './pages/DirectMessages/DirectMessages'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import UserDashBoard from './pages/UserDashBoard/UserDashBoard'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<GetStarted />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<HomePage />} />
          <Route path='/messages' element={<DirectMessages />} />
          <Route path="/messages/:userId" element={<DirectMessages />} />
          <Route path='/dashboard' element={<UserDashBoard />} />
          <Route path='/carpool' element={<CarPool />} />
          <Route path='/lostnfound' element={<LostnFound />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/carrentals' element={<CarRentals />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App