import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Card, Button, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import CompanyJobs from './CompanyJobs';
import CompanyOverView from './CompanyOverView';

const EachCompanyPage = () => {
  const BASE_API_URL = 'http://localhost:8082/api/jobbox';
  const location = useLocation();
  const companyId = location.state?.companyId;
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfHR, setCountOfHR] = useState(0);
  const [countOfJobs, setCountOfJobs] = useState(0);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalContent, setModalContent] = useState(''); // State to manage modal content
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchCountOfApplicationByCompany();
      fetchCountOfHRByCompany();
      fetchCountOfJobsByCompany();
    }
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/displayCompanyById?companyId=${companyId}`);
      const companyData = response.data;
      setCompany(companyData);  // Update state
  
      // Now use companyData instead of company directly
      console.log(companyData.companyName);  // This should log the correct companyName
  setCompanyName(companyData.companyName);
      if (companyData.companyName) {
        fetchCompanyLogo(companyData.companyName);
        fetchCompanyBanner(companyData.companyName);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const fetchCountOfApplicationByCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfApplicationsByCompany?companyId=${companyId}`);
      setCountOfApplications(response.data);
    } catch (error) {
      console.error('Error fetching count of applications:', error);
    }
  };

  const fetchCountOfHRByCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfHRByCompany?companyId=${companyId}`);
      setCountOfHR(response.data);
    } catch (error) {
      console.error('Error fetching count of HRs:', error);
    }
  };

  const fetchCountOfJobsByCompany = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfJobsByCompany?companyId=${companyId}`);
      setCountOfJobs(response.data);
    } catch (error) {
      console.error('Error fetching count of jobs:', error);
    }
  };

  const fetchCompanyLogo = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyLogo(image);
    } catch (error) {
      console.error('Error fetching company logo:', error);
    }
  };
  const fetchCompanyBanner = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyBanner(image);
    } catch (error) {
      console.error('Error fetching company banner:', error);
    }
  };
  const navigateToHRSignin = () => {
   
  };

  const handleBack = () => {
    navigate("/jobdbcompanies"); // Navigate back to previous page
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const openModal = (content) => {
    setModalContent(content); // Set modal content based on button clicked
    setShowModal(true); // Open modal
  };

  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  const handleHRClick = () => {
    openModal('hr'); // Set modal content for HR
  };

  const handleCandidateClick = () => {
    openModal('candidate'); // Set modal content for candidate
  };

  const handleModalOptionClick = (option) => {
    closeModal(); // Close modal after clicking an option
    if (option === 'login') {
      if (modalContent === 'hr') {
        if (company) {
          navigate('/signin');
        } // Navigate to HR sign-in page
      } else if (modalContent === 'candidate') {
        if (company) {
          navigate('/signin');
        } // Handle candidate login logic
      }
    } else if (option === 'register') {
      // Handle registration logic
      if (modalContent === 'hr') {
        if (company) {
          navigate("/signup/hrSignup", { state: { companyName } });
        }  // Navigate to HR sign-in page
      } else if (modalContent === 'candidate') {
        if (company) {
          navigate('/signup/candiSignup');
        } // Handle candidate login logic
      }
    }
  };
  return (
    <Container fluid className='dashboard-container' style={{ background: '#f2f2f2', minHeight: '100vh' }}>

      <Col style={{ overflowY: 'scroll' }}>
      <Card style={{ width: '100%', height: '60%' }}>
            <Card.Body style={{ padding: 0, position: 'relative' }}>
              <div style={{ position: 'relative', height: '55%' }}>
                <img
                  src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                  alt="Company Banner"
                  className="banner-image"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                />
              </div>
              <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
                <label htmlFor="logoInput">
                  <img
                    src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                    alt="Company Logo"
                    className="logo-image"
                    style={{ width: '200px', height: '120px', cursor: 'pointer', border: '5px solid white', borderRadius: '50%' }}
                  />
                </label>
              </div>
              <div><h1 style={{ position: 'absolute', top: '70%', right: '100px'}}>{companyName}</h1></div>
              <ul className="nav-links" style={{ position: 'absolute', top: '80%', left: '50px', listStyleType: 'none', display: 'flex' }}>
              <li>
                  <span>
                    <a onClick={() => handleTabClick('overview')} style={{ paddingLeft: '24px', fontSize:'24px' ,color: activeTab === 'overview' ? 'purple' : 'gray', cursor: 'pointer' }}>
                      About
                    </a>
                  </span>
                </li>

                <li>
                  <span>
                    <a onClick={() => handleTabClick('jobs')} style={{ paddingLeft: '24px', fontSize:'24px' ,color: activeTab === 'jobs' ? 'purple' : 'gray', cursor: 'pointer' }}>
                      Jobs
                    </a>
                  </span>
                </li>
              </ul>

            </Card.Body>
          </Card>

        <Row>
        <Col xs={8}>
              {activeTab === 'home' && (
                <div>
                  <Card onClick={() => handleTabClick('overview')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                    <Card.Body>
                       <h3>About {companyName}</h3>
                      <p>Click to view Overview content...</p>
                    </Card.Body>
                  </Card>

                  <Card onClick={() => handleTabClick('jobs')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                    <Card.Body>
                      <h3>Jobs</h3>
                      <p>Click to view Jobs content...</p>
                    </Card.Body>
                  </Card>
                </div>
              )}
           
            {activeTab === 'overview' && (<CompanyOverView  companyId={companyId} />   )}
            {activeTab === 'jobs' && (
              <CompanyJobs companyId={companyId} />
            )}
          </Col>
          <Col>
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Row className="mb-3">
                  <Col>
                  <Button
                      variant="primary"
                      style={{ marginRight: '12px' }}
                      onClick={handleHRClick}
                    >
                      Claim/Login
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleCandidateClick}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Applicants: {countOfApplications}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                  {countOfHR > 0 ? (
                  <p>HR mapped = Yes</p>
                ) : (
                  <p>HR mapped = No</p>
                )}
                    <h5>Total HR's: {countOfHR}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Total Job Postings: {countOfJobs}</li>
                      <li>Conversion Rate: 12%</li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                      <li>Top Searched Job: Software Engineer</li>
                      <li>User Engagement: 75% daily active users</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
   {/* Modal for Apply button */}
   <Modal
  show={showModal}
  onHide={closeModal}
  // style={{
  //   zIndex: 1050, // Adjust as needed
  //   borderRadius: '10px', // Rounded corners
  //   maxWidth: '400px', // Limit width
  //   marginLeft: 'auto', // Center horizontally
  //   marginRight: 'auto', // Center horizontally
  // }}
>
  <Modal.Header closeButton style={{ backgroundColor: '#faccc', color: 'white', borderBottom: 'none' }}>
    <Modal.Title>Choose an Option</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
    {modalContent === 'hr' && (
      <>
        <Button
          variant="primary"
          onClick={() => handleModalOptionClick('login')}
          style={{ width: '100%', marginBottom: '10px', backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}
        >
          Already have an account - Login
        </Button>
        <Button
          variant="success"
          onClick={() => handleModalOptionClick('register')}
          style={{ width: '100%', backgroundColor: '#00b894', borderColor: '#00b894' }}
        >
          Don't have an account - Register
        </Button>
      </>
    )}
    {modalContent === 'candidate' && (
      <>
        <Button
          variant="primary"
          onClick={() => handleModalOptionClick('login')}
          style={{ width: '100%', marginBottom: '10px', backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}
        >
          Already have an account - Login
        </Button>
        <Button
          variant="success"
          onClick={() => handleModalOptionClick('register')}
          style={{ width: '100%', backgroundColor: '#00b894', borderColor: '#00b894' }}
        >
          Don't have an account - Register
        </Button>
      </>
    )}
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default EachCompanyPage;
