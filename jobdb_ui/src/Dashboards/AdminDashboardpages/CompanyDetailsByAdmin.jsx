import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CompanyDetailsByAdmin = ({ location }) => {
  const [editableCompanyDetails, setEditableCompanyDetails] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    industry: '',
    location: '',
    description: ''
  });

  const history = useHistory();
  const companyName = location.state?.companyName;

  // Fetch company details when component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/getCompanyByName?companyName=${companyName}`);
        setCompanyDetails(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      await axios.put(`${BASE_API_URL}/updateCompanyByName?companyName=${companyName}`, companyDetails);
      alert('Company details updated successfully.');
      history.push({
        pathname: '/company-validation',
      });
    } catch (error) {
      console.error('Error updating company details:', error);
    }
  };

  const handleEditCompanyDetails = () => {
    setEditableCompanyDetails(true);
  };

  const handleSaveCompanyDetails = () => {
    setEditableCompanyDetails(false);
  };

  return (
    <div className='body'>
      <div className='leftside'>
        <AdminleftSide />
      </div>
      <div className='rightside'>
        <div className="company-admin-container">
          <h2>Company Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="company-admin-form-group">
              <label htmlFor="companyName">Company Name: {companyName}</label>
            </div>
            <div className="company-admin-form-group">
              <label htmlFor="location">Location:</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="Enter company location" 
                value={companyDetails.location} 
                onChange={handleChange}  
                disabled={!editableCompanyDetails} 
                required 
              />
            </div>
            <div className="company-admin-form-group">
              <label htmlFor="industry">Industry:</label>
              <input 
                type="text" 
                id="industry" 
                name="industry" 
                placeholder="Industry Type" 
                value={companyDetails.industry} 
                onChange={handleChange} 
                disabled={!editableCompanyDetails} 
                required 
              />
            </div>
            <div className="company-admin-form-group">
              <label htmlFor="discription">Description:</label>
              <textarea 
                id="discription" 
                name="discription" 
                placeholder="Enter company description" 
                value={companyDetails.discription} 
                onChange={handleChange} 
                disabled={!editableCompanyDetails} 
              ></textarea>
            </div>
            <div className='job-save-edit-buttons'>
              {editableCompanyDetails ? (
                <button type="button" onClick={handleSaveCompanyDetails}><FaSave />Save</button>
              ) : (
                <button type="button" onClick={handleEditCompanyDetails}><FaEdit />Edit</button>
              )}
              <button type="submit">Submit</button>
            </div>      
   </form>
    </div>
    </div>
    </div>
  );
}

export default CompanyDetailsByAdmin;
