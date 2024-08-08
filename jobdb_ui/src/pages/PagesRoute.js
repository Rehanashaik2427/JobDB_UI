import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter
import CandidateDashbaordRoute from '../Dashboards/CandidateDashboardpages/CandidateDashbaordRoute';
import HrDashbaordRoute from '../Dashboards/HrDashboardpages/HrDashbaordRoute';
import About from './About';
import CompanRoute from './Companies/CompanRoute';
import EachCompanyPage from './Companies/EachCompanyPage';
import JobboxCompanyPage from './Companies/JobboxCompanyPage';
import Home from './Home';
import AdminRegister from './Session/AdminRegister';
import CandiRegister from './Session/CandiRegister';
import ForgetPassword from './Session/ForgetPassword';
import UserRoute from './Session/UserRoute';
import UserSignin from './Session/UserSignin';

import AdminDashboardRoute from '../Dashboards/AdminDashboardpages/AdminDashboardRoute';
import AboutJobbox from './AboutJobbox';
import Contact from './Contact';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';






const PagesRoute = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/about-jobbox" element={<AboutJobbox />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path='/userRoute/*' element={<UserRoute />} />
          <Route path="/signup/*" element={<UserRoute />} />
          <Route path="/findcompany/*" element={<CompanRoute />} />
          <Route path="/signin" element={<UserSignin />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/jobdbcompanies' element={<JobboxCompanyPage />} />
          <Route path="/jobboxCompanyPage/eachCompanyPage" element={<EachCompanyPage />} />
          <Route path='/candidates' element={<CandiRegister />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
          <Route path='/privacy-and-policy' element={<PrivacyPolicy />} />

          <Route path='/hr-dashboard/*' element={<HrDashbaordRoute />} />
          <Route path='/candidate-dashboard/*' element={< CandidateDashbaordRoute />} />
          <Route path='/admin-register/*' element={<AdminRegister />} />
          <Route path='/admin-dashboard/*' element={<AdminDashboardRoute />} />
        </Routes>

      </Router>
    </div>
  );
}

export default PagesRoute;