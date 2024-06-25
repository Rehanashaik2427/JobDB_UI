import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AdminDashboard = () => {
  const [validatedCompaniesCount, setValidatedCompaniesCount] = useState(0);
  const[validatedHrCount, setValidatedHrCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
      fetchValidatedCompaniesCount();
      fetchValidatedHrCount();
  }, []);

  const fetchValidatedCompaniesCount = async () => {
      try {
          const response = await axios.get('http://localhost:8082/api/jobbox/countValidatedCompanies');
          setValidatedCompaniesCount(response.data);
      } catch (error) {
          console.error('Error fetching count:', error);
      }
  };
  
  const fetchValidatedHrCount = async () => {
    try {
        const response = await axios.get('http://localhost:8082/api/jobbox/countValidatedUsers');
        setValidatedHrCount(response.data);
    } catch (error) {
        console.error('Error fetching count:', error);
    }
};

  return (
    <div className='body'>
     

        <div className='leftside'>
          <AdminleftSide />
        </div>

        <div className="rightSide">
      <div>
        <h2>Admin Dashboard</h2>
      </div>

      <div className="adminDashboard">
        <span>
          <h2>{validatedCompaniesCount}</h2>
          company validated
        </span>
        <span>
          <h2>{validatedHrCount}</h2>
          HR validated
        </span>
        <span>
          <h3>Allowing access to HR</h3>
          <h3>for Job Posting</h3>
        </span>
        <span>
          <h3>Allowing access to Candidate</h3>
          <h3>for Applying Jobs</h3>
        </span>
        <span>
          <h2>200+</h2>
          HR Blocked
        </span>
      </div>

      <div className="applyforValidation">
        <h4>Check for processing User validation!!</h4>
        <p>
            <Link to="/admin-dashboard/admin-action"   onClick={(e) => {
                            e.preventDefault();
                            navigate('/admin-dashboard/admin-action');
                        }}>Check</Link>
        </p>
      </div>
    </div>
    </div>
  )
}

export default AdminDashboard;
