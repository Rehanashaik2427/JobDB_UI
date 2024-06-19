import React from 'react'
import { Route, Routes } from 'react-router-dom'
import FindCompany from './FindCompany.jsx'


export default function CompanRoute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FindCompany />} />
       
      </Routes>
    </div>
  )
}

