import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import UserValidation from './UserValidation'
import AdminAction from './AdminAction'
import CompanyValidation from './CompanyValidation'
import BlockAccount from './BlockAccount'
import CompanyDetailsByAdmin from './CompanyDetailsByAdmin'
import Myprofile from './Myprofile'
import Contacts from './Contacts'
import AddCompanyDetails from './AddCompanyDetails'
import AllowingAccess from './AllowingAccess'

const AdminDashboardRoute = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/user-validation" element={<UserValidation />} />
                <Route path="/admin-action" element={<AdminAction />} />
                <Route path='/company-validation' element={<CompanyValidation />} />
                <Route path='/block-account' element={<BlockAccount />} />
                <Route path='/add-company-details' element={<AddCompanyDetails />} />
                <Route path='/companyDetailsByAdmin' element={<CompanyDetailsByAdmin />} />
                <Route path='/my-profile' element={<Myprofile />} />
                <Route path='/contacts' element={<Contacts />} />
                <Route path='/allowing-access' element={<AllowingAccess/>}/>
        </Routes>
        </div>
    )
}

export default AdminDashboardRoute
