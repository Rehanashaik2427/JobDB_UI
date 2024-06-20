import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CandidateDashboard from './CandidateDashboard'
import CandidatesCompanies from './CandidatesCompanies'
import CandidateJobs from './CandidateJobs'
import MyApplication from './MyApplication'

const CandidateDashbaordRoute = () => {
  return (
  
      <Routes>
        <Route path="/" element={<CandidateDashboard/>} />  
        <Route path='/candidate-jobs' element={<CandidateJobs />}/> 
        <Route path='/candidate-companies' element={<CandidatesCompanies />}/> 
        <Route path='/my-application' element={<MyApplication/>}/>

      </Routes>

  )
}

export default CandidateDashbaordRoute
