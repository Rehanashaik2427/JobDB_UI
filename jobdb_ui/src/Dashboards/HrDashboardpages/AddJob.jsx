import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const AddJob = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const navigate = useNavigate();

  const { userName, userEmail } = location.state || {};
  console.log(userEmail);

  const [formData, setFormData] = useState({
    hrEmail: userEmail || '', // set userEmail to an empty string if it's not available in location.state
    jobTitle: '',
    jobType: '',
    location: '',
    salary: '',
    postingDate: '',
    qualifications: '',
    applicationDeadline: '',
    numberOfPosition: '',
    jobsummary: ''
  });

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      userEmail: userEmail || '', // update userEmail in formData when location.state changes
    }));
  }, [userEmail]);

  const saveJobData = async (formData) => {
    try {
      const response = await fetch(`${BASE_API_URL}/postingJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      return response;
    } catch (error) {
      throw new Error("Invalid Job details");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await saveJobData(formData);
      if (response.ok) {
        console.log("Job posted successfully", formData);
        alert("Job posted successfully");
        navigate('/hr-dashboard/my-jobs/addJob/jodAddSuccess', { state: { userName: userName, userEmail: userEmail } });
      } else {
        console.error("Error posting job");
      }
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={18} className="rightside">
          <Card style={{marginTop:'30px'}}>
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Row style={{marginBottom:'24px'}}>
                  <Col md={6}>
                    <Form.Group controlId="jobTitle">
                      <Form.Label>Job Title:</Form.Label>
                      <Form.Control
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder='Eg: Java Developer , Software Developer , Full Stack Developer'
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="jobType">
                      <Form.Label>Job Type:</Form.Label>
                      <Form.Control
                        type="text"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        placeholder='Eg: FullTime , Contarct , Internship'
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{marginBottom:'24px'}}>
                  <Col md={6}>
                    <Form.Group controlId="postingDate">
                      <Form.Label>Posting Date:</Form.Label>
                      <Form.Control
                        type="date"
                        name="postingDate"
                        value={formData.postingDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="skills">
                      <Form.Label>Skills:</Form.Label>
                      <Form.Control
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                        placeholder='Eg: Java , Python , C , C++ , React , Node'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{marginBottom:'24px'}}>
                  <Col md={6}>
                    <Form.Group controlId="numberOfPosition">
                      <Form.Label>Number of Positions:</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberOfPosition"
                        value={formData.numberOfPosition}
                        onChange={handleChange}
                        required
                        placeholder='Number of openings'
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="salary">
                      <Form.Label>Salary:</Form.Label>
                      <Form.Control
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                        placeholder='Enter Salary'
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{marginBottom:'24px'}}>
                  <Col md={6}>
                    <Form.Group controlId="applicationDeadline">
                      <Form.Label>Application Deadline:</Form.Label>
                      <Form.Control
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="jobsummary">
                  <Form.Label>Job summary: (Add Additional Information)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="jobsummary"
                    value={formData.jobsummary}
                    onChange={handleChange}
                    className="fullWidthTextarea"
                    style={{minHeight:'150px'}}                  
                    />
                </Form.Group>
              </Card.Body>

              <Card.Footer>
                <div className="d-flex justify-content-center">
                  <Button type="submit" className="btn btn-primary m-1 ">Post</Button>
                </div>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );




}
export default AddJob;
