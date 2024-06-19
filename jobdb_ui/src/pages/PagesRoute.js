import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter
import About from './About';
import CompanRoute from './Companies/CompanRoute';
import Home from './Home';
import UserRoute from './Session/UserRoute';
import JobboxCompanyPage from './Companies/JobboxCompanyPage'
import EachCompanyPage from './Companies/EachCompanyPage';

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


        </Routes>

      </Router>
    </div>
  );
}

export default PagesRoute;