import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const ResumeAdd = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [fileType, setFileType] = useState('file');
  const [link, setLink] = useState('');
  const [briefMessage, setBriefMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
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

  const handleTextFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;
      setBriefMessage(text); // Update briefMessage with the text content
    };
    reader.readAsText(event.target.files[0]); // Read the uploaded text file as plain text
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
  
    try {
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
        // Handle text file upload separately if fileType is 'brief' and file is text/plain
      
      }
      if (file && file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = function (event) {
          const text = event.target.result;
          formData.set('briefMessage', text); // Set the text content to formData directly
          axios.post(BASE_API_URL + '/uploadResume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            console.log('File uploaded successfully:', response.data);
            setSuccessMessage('Resume uploaded successfully!');
            setShowModal(true); // Show modal on success
            setLoading(false); // Reset loading state after successful upload
          })
          .catch(error => {
            console.error('Error uploading Resume:', error);
            setSuccessMessage('File upload failed');
            setLoading(false); // Reset loading state after upload failure
          });
        };
        reader.readAsText(file); // Read the uploaded text file as plain text
      } else {
        // For other cases of 'brief' (non-text file or no file selected)
        axios.post(BASE_API_URL + '/uploadResume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('File uploaded successfully:', response.data);
          setSuccessMessage('Resume uploaded successfully!');
          setShowModal(true); // Show modal on success
          setLoading(false); // Reset loading state after successful upload
        })
        .catch(error => {
          console.error('Error uploading Resume:', error);
          setSuccessMessage('File upload failed');
          setLoading(false); // Reset loading state after upload failure
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false); // Reset loading state if an error occurs during form submission
    }
  };
  
  const handleOk = () => {
    setSuccessMessage('');
    setShowModal(false);
    window.location.reload(); // Refresh the page
  };
  const user = {
    userName: userName,
    userId: userId,
  };

  const handleBack = () => {
    navigate('/candidate-dashboard/resume', { state: { userName, userId } }); // Navigate back to previous page
  };
  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };
  return (
    <div className='dashboard-container'>
    
    <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
      <CandidateLeftSide user={{ userName, userId }} />
    </div>
    <div className="hamburger-icon" onClick={toggleLeftSide}>
      <FaBars />
    </div>

    <div className="rightside" style={{
      overflowY: 'scroll'
    }}>

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
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      <label className={`btn btn-outline-primary ${fileType === 'file' ? 'active' : ''}`}>
        <input
          type="radio"
          value="file"
          checked={fileType === 'file'}
          onChange={handleFileTypeChange}
        /> File
      </label>
      <label className={`btn btn-outline-primary ${fileType === 'link' ? 'active' : ''}`}>
        <input
          type="radio"
          value="link"
          checked={fileType === 'link'}
          onChange={handleFileTypeChange}
        /> Link
      </label>
      <label className={`btn btn-outline-primary ${fileType === 'brief' ? 'active' : ''}`}>
        <input
          type="radio"
          value="brief"
          checked={fileType === 'brief'}
          onChange={handleFileTypeChange}
        /> Brief
      </label>
    </div>
  </Col>
</Form.Group>

              {fileType === 'file' && (
                <Form.Group as={Row} className='select-file'>
                  <Form.Label column sm={3}>Select File:</Form.Label>
                  <Col sm={9}>
                    <Form.Control type='file' accept='.pdf, .doc, .docx' onChange={handleFileChange} required />
                  </Col>
                </Form.Group>
              )}

              {fileType === 'link' && (
                <Form.Group as={Row} className='select-link'>
                  <Form.Label column sm={3}>Enter Link:</Form.Label>
                  <Col sm={9}>
                    <Form.Control type='text' value={link} onChange={handleLinkChange} required />
                  </Col>
                </Form.Group>
              )}

              {fileType === 'brief' && (
                <React.Fragment>
                  <Form.Group as={Row} className='message-type'>
                    <Form.Label column sm={3}>Brief Resume:</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as='textarea'
                        placeholder='Write or upload a .txt file'
                        value={briefMessage}
                        onChange={handleBriefMessageChange}
                        disabled={!!file} // Disable textarea if file is selected
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='select-file'>
                    <Form.Label column sm={3}>Upload Text File:</Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type='file'
                        accept='.txt'
                        onChange={handleTextFileChange}
                        disabled={!!briefMessage} // Disable file input if briefMessage is entered
                      />
                    </Col>
                  </Form.Group>
                </React.Fragment>
              )}


              <Form.Group as={Row} className='message-type' style={{ marginTop: '20px' }}>
                <Form.Label column sm={3}>Resume Title:</Form.Label>
                <Col sm={9}>
                  <Form.Control as='textarea' value={message} onChange={handleMessageChange} required/>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Button type="submit" className='uploadResume' disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Resume'}
                  </Button>
                </Col>
              </Form.Group>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success!</Modal.Title>
              </Modal.Header>
              <Modal.Body>{successMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleOk}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>

            {successMessage && <p>{successMessage}</p>}
          </Col>

</div></div>
  );
};

export default ResumeAdd;
