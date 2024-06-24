import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, Dropdown } from 'react-bootstrap';
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



  const [showSettings, setShowSettings] = useState(false);

 
  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

  const handleDelete = async (resumeId) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/deleteResume?resumeId=${resumeId}`)
      if (response.data) {
        alert("Resume Delete")
        window.location.reload(); // Refresh the page
      }
    } catch {
      alert("Failed To delete")
    }

  }
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
      <div className="d-flex justify-content-end">
          <div className="candidate-search">
            <input type='text' placeholder='search' />
            <Button variant="light" onClick={() => alert('Search clicked')}>
              <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
            </Button>
            <div className="user col px-3 header-part-right">
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} />
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
          </div>
        </div>

       

          {showBriefSettings && (
            <div className="modal-summary">
              <div className="modal-content-summary">
                <span className="close" onClick={() => setShowBriefSettings(false)}>&times;</span>
                {showMessage}
              </div>
            </div>
          )}

          <div>
            <h1 style={{ textAlign: 'center' }}>MY RESUMES</h1>

            <div className='resume-div d-flex flex-wrap'>
              {resumes.map((resume, index) => (
                <Card className='resume-card' key={index}>
                  <Card.Body>
                    <Card.Title>Resume : {index + 1}</Card.Title>
                    <Card.Text>{resume.message}</Card.Text>

                    {resume.fileType === 'file' && (
                      <Button variant="primary" size="sm" className='download' onClick={() => handleDownload(resume.id, resume.fileName)}>Download</Button>
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
              ))}
            </div>
            <div className='adding-resumes' style={{ marginTop: '50px' }}>
              <Link to={{ pathname: '/candidate-dashboard/resumeAdd', state: { userName, userId } }} onClick={(e) => {
                e.preventDefault();
                navigate('/candidate-dashboard/resumeAdd', { state: { userName, userId } });
              }} >ADD NEW RESUME</Link>
            </div>
          </div>
  </div>

</div>
  );
};

export default Resume;
