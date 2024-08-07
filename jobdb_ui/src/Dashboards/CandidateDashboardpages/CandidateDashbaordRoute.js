import React from 'react'
import { Route, Routes } from 'react-router-dom'

import CandidateDashboard from './CandidateDashboard'


import CandidateJobs from './CandidateJobs'
import CandidatesCompanies from './CandidatesCompanies'
import CompamyPage from './CompanyPage'
import DreamCompany from './DreamCompany'
import JobDescription from './JobDescription'
import MyApplication from './MyApplication'
import Payment from './Payment'
import Profile from './Profile'
import Resume from './Resume'
import ResumeAdd from './ResumeAdd'
import ResumeSelectionPopup from './ResumeSelectionPopup'

const CandidateDashbaordRoute = () => {
  return (

    <Routes>

      <Route path="/" element={<CandidateDashboard />} />
      <Route path='/candidate-jobs' element={<CandidateJobs />} />
      <Route path='/candidate-companies' element={<CandidatesCompanies />} />
      <Route path='/resume' element={<Resume />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/payment' element={<Payment />} />
      <Route path='/my-application' element={<MyApplication />} />
      <Route path='/resumeAdd' element={<ResumeAdd />} />
      <Route path='/companyPage' element={<CompamyPage />} />
      <Route path='/resumePopUp' element={<ResumeSelectionPopup />} />
      <Route path='/dream-company' element={<DreamCompany/>}/>
      <Route path='/job-description' element={<JobDescription />}/>
    </Routes>

  )
}

export default CandidateDashbaordRoute
