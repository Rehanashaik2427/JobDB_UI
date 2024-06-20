import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CandidateDashboard from './CandidateDashboard'
import CandidateJobs from './CandidateJobs'
import CandidatesCompanies from './CandidatesCompanies'
import MyApplication from './MyApplication'
import Payment from './Payment'
import Profile from './Profile'
import Resume from './Resume'

const CandidateDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CandidateDashboard/>} />   
        <Route path='/candidate-jobs' element={<CandidateJobs />}/>
        <Route path='/candidate-companies' element={<CandidatesCompanies />}/>
        <Route path='/my-application' element={<MyApplication />}/>
        <Route path='/resume' element={<Resume />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/payment' element={<Payment />}/>
      </Routes>
    </div>
  )
}

export default CandidateDashbaordRoute
