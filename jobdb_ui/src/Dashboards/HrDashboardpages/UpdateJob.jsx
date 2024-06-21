import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FaEdit, FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateJob = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const { userName, userEmail, jobId } = location.state || {};



  const navigate = useNavigate();

  const [editableJobDetails, setEditableJobDetails] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    postingDate: '',
    qualifications: '',
    applicationDeadline: '',
    numberOfPositions: '',
    jobSummary: '',
    skills: '',
  });



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
      await axios.put(`${BASE_API_URL}/updateJob?jobId=${jobId}`, formData);
      alert('Job details updated successfully.');
      navigate('/hr-dashboard/my-jobs', {
        state: {
          userName: userName,
          userEmail: userEmail,
        },
      });
    } catch (error) {
      console.error('Error updating job details:', error);
    }
  };

  return (
    <Container fluid className="dashboard-container">
    <Row>
      <Col md={3} className="leftside">
        {/* Your HrLeftSide component */}
      </Col>
      <Col md={9} className="rightside">
        <Form className="job-posting-form" onSubmit={handleSubmit}>
          <div>
            <h2 style={{ textDecoration: 'underline' }}>Job Details</h2>
            <div className='job-details-row'>
              <Form.Group className='job-form-group'>
                <Form.Label htmlFor="jobTitle">Job Title:</Form.Label>
                <Form.Control
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </Form.Group>
              <Form.Group className='job-form-group'>
                <Form.Label htmlFor="jobType">Job Type:</Form.Label>
                <Form.Control
                  type="text"
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </Form.Group>
              <Form.Group className='job-form-group'>
                <Form.Label htmlFor="postingDate">Posting Date:</Form.Label>
                <Form.Control
                  type="date"
                  id="postingDate"
                  name="postingDate"
                  value={formData.postingDate}
                  onChange={handleChange}
                  disabled={!editableJobDetails}
                />
              </Form.Group>
            </div>
            {/* Continue with other form fields */}
            <div className='job-save-edit-buttons'>
              {editableJobDetails ? (
                <Button variant="primary" type="button" onClick={handleSaveJobDetails}><FaSave /> Save</Button>
              ) : (
                <Button variant="info" type="button" onClick={handleEditJobDetails}><FaEdit /> Edit</Button>
              )}
              <Button variant="success" type="submit">Post</Button>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  </Container>
);
};

export default UpdateJob;
