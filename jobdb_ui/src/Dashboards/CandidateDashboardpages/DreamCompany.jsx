import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CandidateDashboard.css';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ResumeSelectionPopup from './ResumeSelectionPopup';
import CandidateLeftSide from './CandidateLeftSide';

   const BASE_API_URL="http://localhost:8082/api/jobbox";

const DreamCompany = () => {
  const [showMessage, setShowMessage] = useState(false);
  const location=useLocation();
  const userName=location.state?.userName;
  const userId=location.state?.userId;
 
  const currentDate = new Date().toLocaleDateString();

  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    companyEmail: '',
    industry: '',
    location: '',
    discription: '',      // Corrected typo
    date: '',
  });

  const companyName=formData.companyName;
  console.log(companyName);
 
  const [showResumePopup, setShowResumePopup] = useState(false);
  const handleApplyButtonClick = () => {
    setShowResumePopup(true);
};

  const [resumes, setResumes] = useState([]);
  useEffect(() => {
    // Fetch resumes data from the backend
    axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
        .then(response => {
            setResumes(response.data);
        })
        .catch(error => {
            console.error('Error fetching resumes:', error);
        });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleResumeSelect = async (resumeId) => {
    if (resumeId) {
        // Save company data first
        await saveCompanyData(formData);

        // If saving is successful, then apply for the job
        await applyJob(resumeId);

        // Close the resume selection popup
        setShowResumePopup(false);
    }
};


const applyJob=async(resumeId)=>{
  const appliedOn = new Date().toLocaleDateString();

         
    try {
        const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${companyName}&appliedOn=${appliedOn}&resumeId=${resumeId}`);

        
        console.log(response.data);
       

        if (response.data) {
            alert("You have successfully applied for this job");

            setShowMessage(true);
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
    
};


const saveCompanyData = async (formData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/saveCompany`, formData);
    console.log('Company details submitted:', response.data);
    
    setFormData({
      companyName:companyName,
      contactNumber: '',
      companyEmail: '',
      industry: '',
      location: '',
      discription: '',
      date: currentDate,
    });

   
  } catch (error) {
    console.error('Error during submission:', error);
    
   
    
  }
 
};



  const handleSubmit = async (event) => {
    event.preventDefault();
   
  };

  const user = {
    userName: userName,
    
    userId: userId,
   };
  return (
    <div className='candidate-dashboard-container'>
       <div className='left-side'>
       <CandidateLeftSide user={user} />
     </div>
     <div className='rightside'>
      <div className="centered-content">
      {showResumePopup && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setShowResumePopup(false)}>&times;</span>
                    <ResumeSelectionPopup
                        resumes={resumes}
                        onSelectResume={handleResumeSelect}
                        onClose={() => setShowResumePopup(false)}
                    />
                </div>
            </div>  
        )}
        <form onSubmit={handleSubmit} className="centered-form">
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="resume">Resume:</label>
            <button onClick={handleApplyButtonClick}>Select Resume</button>
          </div>
          <div className="form-group">
            <input type="submit" value="Apply" className="apply-button" />
          </div>
          {showMessage && (
        <div className="success-message">
          <h1>Congratulations</h1>
          <h3>You successfully applied to your Dream Company</h3>
          <h3><Link   to={{
          pathname: '/candidate-dashboard',
          state: { userName: userName, userId:userId }
        }}>Go back to dashboard</Link></h3>
        </div>
      )}
        </form>
       
      </div>
   
    </div>
    </div>
  );
};

export default DreamCompany;
