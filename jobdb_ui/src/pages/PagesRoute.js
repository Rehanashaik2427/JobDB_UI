import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter
import HrDashboard from '../Dashboards/HrDashboardpages/HrDashboard';
import About from './About';
import CompanRoute from './Companies/CompanRoute';
import JobboxCompanyPage from './Companies/JobboxCompanyPage';
import Home from './Home';
import ForgetPassword from './Session/ForgetPassword';
import UserRoute from './Session/UserRoute';


import EachCompanyPage from './Companies/EachCompanyPage';

import UserSignin from './Session/UserSignin';
import CandidateDashboard from '../Dashboards/CandidateDashboardpages/CandidateDashboard';


const PagesRoute = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<About />} />
          <Route path='/userRoute/*' element={<UserRoute />} />
          <Route path="/signup/*" element={<UserRoute />} />
          <Route path="/findcompany/*" element={<CompanRoute />} />

          <Route path='/jobboxCompanyPage' element={<JobboxCompanyPage />} />
          <Route path="/jobboxCompanyPage/eachCompanyPage/:companyId" component={EachCompanyPage} />


          <Route path="/signin" element={<UserSignin />} />
          <Route path='/forgetpassword' element={<ForgetPassword />}/>
          <Route path='/jobdbcompanies' element={<JobboxCompanyPage />}/>


          <Route path='/hr-dashboard/*' element={<HrDashboard />}/>
          <Route path='/candidate-dashboard/*' element={< CandidateDashboard/>} />
        </Routes>

      </Router>
    </div>
  );
}

export default PagesRoute;