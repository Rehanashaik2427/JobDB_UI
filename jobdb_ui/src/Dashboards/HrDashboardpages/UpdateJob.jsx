import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from "react-icons/fa";
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HrLeftSide from "./HrLeftSide";

const UpdateJob = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const history=useHistory();
  const [userData, setUserData] = useState({});
  
  const [editableJobDetails, setEditableJobDetails] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const { jobId, userName, userEmail } = location.state;

  console.log(userEmail);
  
  
  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  const fetchJobDetails = async (id) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getJob`, { params: { jobId: id } });
      setJobDetails(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    postingdate: '',
    qualifications: '',
    applicationDeadline: '',
    positions: '',
    postingDate: '',
    jobsummary: ''
  });

  const user = {
    userName: userName,
    userEmail: userEmail,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditJobDetails = () => {
    setEditableJobDetails(true);
  };

  const handleSaveJobDetails = () => {
    setEditableJobDetails(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_API_URL}/updateJob?jobId=${jobId}`,formData); // Assuming your endpoint for updating jobs is /updateJob
      alert('Job details updated successfully.');
      history.push({
        pathname: '/post-jobs',
        state: {
          userName: userName,
          userEmail: userEmail,
          
        }
      });

    } catch (error) {
      console.error('Error updating job details:', error);
    }
  };

  

  return (
    <div className='hr-dashboard-container'>
      <div className="hr-leftside">
        <HrLeftSide user={user} />
      </div>

      <div className='hr-rightside'>
        <form className="job-posting-form" onSubmit={handleSubmit}>
          <div>
            <h2 style={{ textDecoration: 'underline' }}>Job Details </h2>
            <div className='job-details-row'>
              <div className='job-form-group'>
                <label htmlFor="jobTitle">Job Title:</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </div>
              <div className='job-form-group'>
                <label htmlFor="jobType">Job Type:</label>
                <input
                  type="text"
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </div>
              <div className='job-form-group'>
                <label htmlFor="postingdate">Posting Date:</label>
                <input
                  type="date"
                  id="postingdate"
                  name="postingDate"
                  value={formData.postingDate}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </div>
            </div>
            <div className='job-details-row'>
              <div className='job-form-group'>
                <label htmlFor="skills">Skills:</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </div>
              <div className='job-form-group'>
                <label htmlFor="positions">Number of Positions:</label>
                <input
                  type="number"
                  id="positions"
                  name="numberOfPosition"
                  value={formData.numberOfPosition}
                  onChange={handleChange}
                  disabled={!editableJobDetails}                />
              </div>
              <div className='job-form-group'>
                <label htmlFor="deadline">Application Deadline:</label>
                <input
                  type="date"
                  id="deadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </div>
              <div className='job-form-group'>
                <label htmlFor="jobsummary">Job summary: Add Additional Information</label>
                <textarea
                  id="jobsummary"
                  name="jobsummary"
                  value={formData.jobsummary}
                  onChange={handleChange}
                  className="fullWidthTextarea"
                  disabled={!editableJobDetails}
                />
              </div>
            </div>
            <div className='job-save-edit-buttons'>
            
              {editableJobDetails ? (
                <button type="button" onClick={handleSaveJobDetails}><FaSave />Save</button>
              ) : (
                <button type="button" onClick={handleEditJobDetails}><FaEdit />Edit</button>
              )}
               <button type="submit">
              Post

               </button>
            </div>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;
