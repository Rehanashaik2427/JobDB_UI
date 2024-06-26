import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form, Modal } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const DreamCompany = () => {
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString();

  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    companyEmail: '',
    industry: '',
    location: '',
    discription: '',      // Corrected typo
    date: currentDate,
  });

  const companyName = formData.companyName;
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


  const applyJob = async (resumeId) => {
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
        companyName: companyName,
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
    <div className='dashboard-container'>
    <div className='left-side'>
      <CandidateLeftSide user={user} />
    </div>

    <div className='rightside'>
          <Container>
            <div className="centered-content">
              {showResumePopup && (
                <Modal show={showResumePopup} onHide={() => setShowResumePopup(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Select Resume</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ResumeSelectionPopup
                      resumes={resumes}
                      onSelectResume={handleResumeSelect}
                      onClose={() => setShowResumePopup(false)}
                    />
                  </Modal.Body>
                </Modal>
              )}
              <Form onSubmit={handleSubmit} className="centered-form">
                <Form.Group>
                  <Form.Label htmlFor="companyName">Company Name:</Form.Label>
                  <Form.Control
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <br></br><Form.Group>
                  <Form.Label htmlFor="resume">Resume:</Form.Label>
                  <Button variant='info' onClick={handleApplyButtonClick}>Select Resume</Button>
                </Form.Group>
             
                {showMessage && (
                  <Card className="success-message">
                  <Card.Body>
                    <Card.Title>Congratulations</Card.Title>
                    <Card.Text>
                      You successfully applied to your Dream Company
                    </Card.Text>
                    <Card.Text>
                      <Link to={{
                        pathname: '/candidate-dashboard',
                        state: { userName: userName, userId: userId }
                      }} onClick={(e) => {
                        e.preventDefault();
                        navigate('/candidate-dashboard', { state: { userName, userId } });
                      }}>Go back to dashboard</Link>
                    </Card.Text>
                  </Card.Body>
                </Card>
                )}
              </Form>
            </div>
          </Container>
</div></div>
  );
};

export default DreamCompany;
