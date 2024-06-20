import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CandidateDashboard from './CandidateDashboard'
import CandidateJobs from './CandidateJobs'

const CandidateDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CandidateDashboard/>} />  
        <Route path='/candidate-dashboard/candidate-jobs' element={<CandidateJobs />}/> 
      </Routes>
    </div>
  )
}

export default CandidateDashbaordRoute
