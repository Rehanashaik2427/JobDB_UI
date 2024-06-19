import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HrLeftSide from './HrLeftSide';
import "./JobAddSuccessful.css";
const JobAddSuccessful = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const { userName, userEmail } = location.state || {};


  console.log(userEmail);




  return (
    <div className='hr-dashboard-container'>
      <div className='hr-leftside'>
        <HrLeftSide user={{userName,userEmail}}/>
      </div>
      <div className='hr-rightside'>
        <div className='jobAddedSuccess'>
          <h2>Job Successfully Added!</h2>
          <p>Thank you {userName} for adding the job.</p>
          <p>You can go back to the dashboard or add another job:</p>
            <Link to={{ pathname:'/post-jobs',state: { userName, userEmail }}}>Go to Jobs</Link>
          <br />
          <Link to={{ pathname: '/addJob', state: { userName, userEmail } }}>Add Another Job</Link>
        </div>
      </div>

    </div>

  );
};

export default JobAddSuccessful;
