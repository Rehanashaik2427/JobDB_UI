import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddJob from './AddJob.jsx'
import ApplicationDetails from './ApplicationDetails.jsx'
import Applications from './Applications.jsx'
import CompanyShowCase from './CompanyShowCase.jsx'
import DreamApplication from './DreamApplications.jsx'
import HrDashboard from './HrDashboard.jsx'
import HrProfile from './HrProfile.jsx'
import JobAddSuccessful from './JobAddSuccessful.jsx'
import MyJobs from './MyJobs.jsx'
import People from './People.jsx'
import PostedJobs from './PostedJobs.jsx'
import UpdateJob from './UpdateJob.jsx'
import ViewApplications from './ViewApplications.jsx'


const HrDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HrDashboard />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/posted-jobs" element={<PostedJobs   />} />
        <Route path="/company-showcase" element={<CompanyShowCase   />} />
      <Route path="/people" element={<People />} />
      <Route path="/hr-applications" element={<Applications />} />
      <Route path="/profile" element={<HrProfile />} />
      <Route path="/dream-applications" element={<DreamApplication />} />
      <Route path="/hr-applications/view-applications" element={<ViewApplications />} />
      <Route path="/hr-applications/view-applications/applicationDetails" element={<ApplicationDetails />} />
      <Route path="/my-jobs/addJob" element={<AddJob />} />
      <Route path="/my-jobs/addJob/jodAddSuccess" element={<JobAddSuccessful />} />
    

      <Route path="/my-jobs/update-job" element={<UpdateJob />} />
     
      </Routes>

    </div>
  )
}

export default HrDashbaordRoute
