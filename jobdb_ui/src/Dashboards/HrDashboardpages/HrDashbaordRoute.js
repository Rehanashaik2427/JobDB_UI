import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Applications from './Applications.jsx'
import HrDashboard from './HrDashboard.jsx'
import HrProfile from './HrProfile.jsx'
import MyJobs from './MyJobs.jsx'
import People from './People.jsx'
import PostedJobs from './PostedJobs.jsx'


const HrDashbaordRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HrDashboard />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/posted-jobs" element={<PostedJobs   />} />
      <Route path="/people" element={<People />} />
      <Route path="/hr-applications" element={<Applications />} />
      <Route path="/profile" element={<HrProfile />} />
      </Routes>

    </div>
  )
}

export default HrDashbaordRoute
