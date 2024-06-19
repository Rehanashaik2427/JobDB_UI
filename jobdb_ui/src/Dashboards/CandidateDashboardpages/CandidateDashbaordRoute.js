import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CandidateDashboard from './CandidateDashboard'

const HrDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CandidateDashboard/>} />   
      </Routes>
    </div>
  )
}

export default HrDashbaordRoute
