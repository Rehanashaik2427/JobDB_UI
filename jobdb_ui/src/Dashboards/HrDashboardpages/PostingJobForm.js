import React, { useState } from 'react';


const PostingJobForm = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [eligibilityCriteria, setEligibilityCriteria] = useState('');
    const [requiredExperience, setRequiredExperience] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      
      
      console.log('Job posted:', {
        jobTitle,
        jobDescription,
        jobLocation,
        jobType,
        salaryRange,
        applicationDeadline,
        eligibilityCriteria,
        requiredExperience,
      });
      // Reset form fields
      setJobTitle('');
      setJobDescription('');
      setJobLocation('');
      setJobType('');
      setSalaryRange('');
      setApplicationDeadline('');
      setEligibilityCriteria('');
      setRequiredExperience('');
    };
  
  
    return (
      <div className="job-posting-form-container">
         <div className="job-posting-form">
        {/* <h2>Post a Job</h2> */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="jobTitle">Job Title:</label>
          <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
  
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea id="jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required></textarea>
  
          <label htmlFor="jobLocation">Job Location:</label>
          <input type="text" id="jobLocation" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} required />
  
          <label htmlFor="jobType">Job Type:</label>
          <select id="jobType" value={jobType} onChange={(e) => setJobType(e.target.value)} required>
            <option value="">Select job type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
          </select>
        
          <label htmlFor="eligibilityCriteria">Eligibility Criteria:</label>
        <textarea
          id="eligibilityCriteria"
          value={eligibilityCriteria}
          onChange={(e) => setEligibilityCriteria(e.target.value)}
          required
        ></textarea>

        <label htmlFor="requiredExperience">Required Experience:</label>
        <input
          type="text"
          id="requiredExperience"
          value={requiredExperience}
          onChange={(e) => setRequiredExperience(e.target.value)}
          required
        />
          <label htmlFor="salaryRange">Salary Range:</label>
          <input type="text" id="salaryRange" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
  
          <label htmlFor="applicationDeadline">Application Deadline:</label>
          <input type="date" id="applicationDeadline" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} required />
  
          <button type="submit">Post Job</button>
        </form>
      </div>
      </div>
     
    );
  };

export default PostingJobForm
