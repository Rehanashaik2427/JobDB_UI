import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { FaEdit, FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

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
    numberOfPosition: '',
    jobsummary: '',
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
        <Col md={2} className="leftside">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <Col md={18} className="rightside">
          <Card style={{ marginTop: '20px' }}>
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Row style={{ marginBottom: '24px' }}>
                  <Col md={6}>
                    <Form.Group controlId="jobTitle">
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
                  </Col>
                  <Col md={6}>
                    <Form.Group className='jobType'>
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
                  </Col>
                </Row>

                <Row style={{ marginBottom: '24px' }}>
                  <Col md={6}>
                    <Form.Group className='postingDate'>
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
                  </Col>
                  <Col md={6}>
                    <Form.Group className='skills'>
                      <Form.Label htmlFor="skills">Skills:</Form.Label>
                      <Form.Control
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        disabled={!editableJobDetails}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginBottom: '24px' }}>
                  <Col md={6}>
                    <Form.Group className='numberOfPosition'>
                      <Form.Label htmlFor="numberOfPosition">Number of Positions:</Form.Label>
                      <Form.Control
                        type="number"
                        id="numberOfPosition"
                        name="numberOfPosition"
                        value={formData.numberOfPosition}
                        onChange={handleChange}
                        disabled={!editableJobDetails}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='salary'>
                      <Form.Label htmlFor="salary">Salary:</Form.Label>
                      <Form.Control
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        disabled={!editableJobDetails}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ marginBottom: '24px' }}>
                  <Col md={6}>
                    <Form.Group className='applicationDeadline'>
                      <Form.Label htmlFor="applicationDeadline">Application Deadline:</Form.Label>
                      <Form.Control
                        type="date"
                        id="applicationDeadline"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        disabled={!editableJobDetails}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="jobsummary">
                  <Form.Label htmlFor="jobsummary">Job summary:</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="jobsummary"
                    name="jobsummary"
                    value={formData.jobsummary}
                    onChange={handleChange}
                    disabled={!editableJobDetails}
                    style={{minHeight:'150px'}}
                  />
                </Form.Group>


              </Card.Body>
              <Card.Footer>
                <div className='job-save-edit-buttons'>
                  {editableJobDetails ? (
                    <Button variant="primary" type="button" onClick={handleSaveJobDetails}><FaSave /> Save</Button>
                  ) : (
                    <Button variant="info" type="button" onClick={handleEditJobDetails}><FaEdit /> Edit</Button>
                  )}
                  <Button variant="success" type="submit">Post</Button>

                </div>
              </Card.Footer>

            </Form>
          </Card>
        </Col >
      </Row >
    </Container >
  );
};

export default UpdateJob;
