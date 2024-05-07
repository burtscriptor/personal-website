import { useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <>
    <Routes>
     <Route path='/' element={<LandingPage/>} />
     <Route path='/homePage' element={<HomePage/>} />
     </Routes>
    </>
  )
}

export default App
