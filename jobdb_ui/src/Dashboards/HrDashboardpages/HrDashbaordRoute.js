import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HrDashboard from './HrDashboard'

const HrDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HrDashboard />} />   
      </Routes>
    </div>
  )
}

export default HrDashbaordRoute
