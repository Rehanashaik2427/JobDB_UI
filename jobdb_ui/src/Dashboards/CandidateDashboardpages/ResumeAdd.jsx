import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const ResumeAdd = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [fileType, setFileType] = useState('file');
  const [link, setLink] = useState('');
  const [briefMessage, setBriefMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const handleBriefMessageChange = (event) => {
    setBriefMessage(event.target.value);
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('fileType', fileType);
    formData.append('message', message);

    if (fileType === 'file') {
      formData.append('file', file);
    } else if (fileType === 'link') {
      formData.append('link', link);
    } else if (fileType === 'brief') {
      formData.append('briefMessage', briefMessage);
    }

    try {
      const response = await axios.post(BASE_API_URL + '/uploadResume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      if (response) {
      };

      console.log('File uploaded successfully:', response.data);
      if (response.status === 200) {
        setSuccessMessage('Resume uploaded successfully!');

      } else {

        console.error('Resume upload failed');

        setSuccessMessage('File upload failed');

      }
    } catch (error) {
      console.error('Error uploading Resume:', error);
    }
  };

  const user = {
    userName: userName,
    userId: userId,
  };
  const handleBack = () => {
    navigate('/candidate-dashboard/resume', { state: { userName, userId } }); // Navigate back to previous page
  };
  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <CandidateLeftSide user={user} />
      </div>

      <div className='rightside'>
  
          <Col xs={6}>
            <Button onClick={handleBack} variant="secondary">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

          </Col>
          <Col sm={9} className='resume-page' style={{ paddingLeft: '20px' }}>
            <h2>Add Resume</h2>
            <Form onSubmit={handleSubmit} className='resume-Add'>
              <Form.Group as={Row} className='select-type'>
                <Form.Label column sm={3}>Select Type:</Form.Label>
                <Col sm={9}>
                  <Form.Control as='select' value={fileType} onChange={handleFileTypeChange}>
                    <option value="file">File</option>
                    <option value="link">Link</option>
                    <option value="brief">Brief</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              {fileType === 'file' && (
                <Form.Group as={Row} className='select-file'>
                  <Form.Label column sm={3}>Select File:</Form.Label>
                  <Col sm={9}>
                    <Form.Control type='file' accept='.pdf, .doc, .docx' onChange={handleFileChange} />
                  </Col>
                </Form.Group>
              )}

              {fileType === 'link' && (
                <Form.Group as={Row} className='select-link'>
                  <Form.Label column sm={3}>Enter Link:</Form.Label>
                  <Col sm={9}>
                    <Form.Control type='text' value={link} onChange={handleLinkChange} />
                  </Col>
                </Form.Group>
              )}

              {fileType === 'brief' && (
                <Form.Group as={Row} className='message-type'>
                  <Form.Label column sm={3}>Brief Resume:</Form.Label>
                  <Col sm={9}>
                    <Form.Control as='textarea' value={briefMessage} onChange={handleBriefMessageChange} />
                  </Col>
                </Form.Group>
              )}

              <Form.Group as={Row} className='message-type' style={{ marginTop: '20px' }}>
                <Form.Label column sm={3}>Resume Title:</Form.Label>
                <Col sm={9}>
                  <Form.Control as='textarea' value={message} onChange={handleMessageChange} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Button type="submit" className='uploadResume'>Upload Resume</Button>
                </Col>
              </Form.Group>
            </Form>

            {successMessage && <p>{successMessage}</p>}
          </Col>

       </div>
       
       </div>
       
       
  );
};

export default ResumeAdd;