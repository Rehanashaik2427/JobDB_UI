import React from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom'; // Use HashRouter
import About from './About';
import CompanRoute from './Companies/CompanRoute';
import Home from './Home';
import UserRoute from './Session/UserRoute';

const PagesRoute = () => {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<About />} />
          <Route path='/userRoute/*' element={<UserRoute />}/>
          <Route path="/signup/*" element={<UserRoute />} />
          <Route path="/findcompany/*" element={<CompanRoute />} />
        </Routes>
      
      </Router>
    </div>
  );
}

export default PagesRoute;