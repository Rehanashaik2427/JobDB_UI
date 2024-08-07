import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Modal } from 'react-bootstrap';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'; // Import SweetAlert2
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const Resume = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [showMessage, setShowMessage] = useState(false);
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

  // Function to handle resume download
  const handleDownload = async (resumeId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/jobbox/downloadResume?resumeId=${resumeId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const handleBrief = async (resumeId, fileType) => {

    const response = await axios.get(`http://localhost:8082/api/jobbox/getBriefResume?resumeId=${resumeId}`);
    if (response) {
      setShowMessage(response.data);
      setShowBriefSettings(!showBriefSettings);

    }

  }

  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

  const handleDelete = async (resumeId, fileName) => {
    try {
      const result = await swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${BASE_API_URL}/deleteResume?resumeId=${resumeId}`);
        if (response.data) {
          setResumes(prevResumes => prevResumes.filter(resume => resume.id !== resumeId));
          swal.fire('Deleted!', `${fileName} has been deleted.`, 'success');
        }
      } else {
        swal.fire('Cancelled', 'Your resume is safe', 'error');
      }
    } catch (error) {
      swal.fire('Failed', 'Error deleting resume', 'error');
      console.error('Error deleting resume:', error);
    }
  };

  const user = {
    userName: userName,

    userId: userId,
  };
  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);

  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };
  return (


    <div className='dashboard-container'>




      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} />
      </div>

      <div className="right-side">
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <div
                className="initials-placeholder"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {initials}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/">
                <i className="i-Data-Settings me-1" /> Account settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                <i className="i-Lock-2 me-1" /> Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>



        {showBriefSettings && (
          <Modal show={showBriefSettings} onHide={() => setShowBriefSettings(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Brief Resume</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }}>
              {showMessage}
            </Modal.Body>
          </Modal>
        )}


        <div>
          <h1 className='text-center'>MY RESUMES</h1>
          <div className="cards d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content' }}>
            {resumes.length === 0 ? (
              <div className="no-resumes" style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
                <h4>No resumes found</h4>
              </div>
            ) : (
              resumes.map((resume, index) => (
                <Card className='resume-card' style={{ width: '200px', margin: '12px' }} key={index}>
                  <Card.Body>
                    <Card.Title>Resume : {index + 1}</Card.Title>
                    <Card.Text>{resume.message}</Card.Text>

                    {resume.fileType === 'file' && (
                      <Button size="sm" className='download' variant="primary" onClick={() => handleDownload(resume.id, resume.fileName)}>Download</Button>
                    )}
                    {resume.fileType === 'link' && (
                      <Card.Link href={resume.fileName} target="_blank">Open Link</Card.Link>
                    )}
                    {resume.fileType === 'brief' && (
                      <Button variant="secondary" size="sm" className='open-brief-modal' onClick={() => handleBrief(resume.id, resume.fileType)}>Open Brief</Button>
                    )}

                    <Button variant="danger" size="sm" className='delete' style={{ marginLeft: '10px' }} onClick={() => handleDelete(resume.id, resume.fileName)}>Delete</Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
          <div className='adding-resumes' style={{ marginTop: '50px' }}>
            <Link to={{ pathname: '/candidate-dashboard/resumeAdd', state: { userName, userId } }} onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/resumeAdd', { state: { userName, userId } });
            }} ><Button>ADD NEW RESUME</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
