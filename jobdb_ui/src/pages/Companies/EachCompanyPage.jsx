import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
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
  const [countOfTotalJobs, setCountOfTotalJobs] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchCountOfApplicationByCompany();
      fetchCountOfHRByCompany();
      fetchCountOfJobsByCompany();
      fetchCountOfTotalJobsByCompany()
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
        fetchSocialMediaLinks(companyData.companyName)
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

  const fetchCountOfTotalJobsByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/countOfTotalJobsByCompany?companyId=${companyId}`
      );
      setCountOfTotalJobs(response.data);
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
          navigate("/signup/userSignup", { state: { companyName } });
        }  // Navigate to HR sign-in page
      } else if (modalContent === 'candidate') {
        if (company) {
          navigate('/signup/userSignup');
        } // Handle candidate login logic
      }
    }
  };


  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: ''
  });
  const fetchSocialMediaLinks = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getSocialMediaLinks`, {
        params: { companyName },
      });
      const { facebookLink, twitterLink, instagramLink, linkedinLink } = response.data;
      setSocialMediaLinks({
        facebookLink,
        twitterLink,
        instagramLink,
        linkedinLink,
      });
    } catch (error) {
      console.error('Error fetching social media links:', error);
    }
  };

  const handleCompanyIconClick = (socialMedia) => {
    let url;
    switch (socialMedia) {
      case 'Facebook':
        url = socialMediaLinks.facebookLink || `https://www.facebook.com/${companyName}`;
        break;
      case 'Twitter':
        url = socialMediaLinks.twitterLink || `https://twitter.com/${companyName}`;
        break;
      case 'Instagram':
        url = socialMediaLinks.instagramLink || `https://www.instagram.com/${companyName}`;
        break;
      case 'LinkedIn':
        url = socialMediaLinks.linkedinLink || `https://www.linkedin.com/company/${companyName}`;
        break;
      default:
        url = '';
    }
    if (url) {
      window.open(url, '_blank');
    }
  };
  return (
    <div className='dashboard-container'>
      <Col>
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
            <div>          <h1 style={{ position: 'absolute', top: '60%', right: '100px' }}>{companyName}</h1>
              <div className='social-icons-company' style={{ position: 'absolute', top: '75%', right: '100px' }}>
                {socialMediaLinks.facebookLink || companyName ? (
                  <FaFacebook onClick={() => handleCompanyIconClick('Facebook')} style={{ fontSize: '24px', color: '#3b5998', cursor: 'pointer', margin: '0 5px' }} />
                ) : (
                  <FaFacebook onClick={() => handleCompanyIconClick('Facebook')} style={{ fontSize: '24px', color: '#3b5998', cursor: 'pointer', margin: '0 5px' }} />
                )}
                {socialMediaLinks.twitterLink || companyName ? (
                  <FaTwitter onClick={() => handleCompanyIconClick('Twitter')} style={{ fontSize: '24px', color: '#1da1f2', cursor: 'pointer', margin: '0 5px' }}/>
                ) : (
                  <FaTwitter onClick={() => handleCompanyIconClick('Twitter')} style={{ fontSize: '24px', color: '#1da1f2', cursor: 'pointer', margin: '0 5px' }}/>
                )}
                {socialMediaLinks.instagramLink || companyName ? (
                  <FaInstagram onClick={() => handleCompanyIconClick('Instagram')} style={{ fontSize: '24px', color: '#e4405f', cursor: 'pointer', margin: '0 5px' }}/>
                ) : (
                  <FaInstagram onClick={() => handleCompanyIconClick('Instagram')} style={{ fontSize: '24px', color: '#e4405f', cursor: 'pointer', margin: '0 5px' }} />
                )}
                {socialMediaLinks.linkedinLink || companyName ? (
                  <FaLinkedin onClick={() => handleCompanyIconClick('LinkedIn')} style={{ fontSize: '24px', color: '#0077b5', cursor: 'pointer', margin: '0 5px' }}/>
                ) : (
                  <FaLinkedin onClick={() => handleCompanyIconClick('LinkedIn')} style={{ fontSize: '24px', color: '#3b5998', cursor: 'pointer', margin: '0 5px' }}/>
                )}
              </div>
            </div>
            <ul className="nav-links" style={{ position: 'absolute', top: '80%', left: '50px', listStyleType: 'none', display: 'flex' }}>
              <li>
                <span>
                  <a onClick={() => handleTabClick('overview')} style={{ paddingLeft: '24px', fontSize: '24px', color: activeTab === 'overview' ? 'purple' : 'gray', cursor: 'pointer' }}>
                    About
                  </a>
                </span>
              </li>

              <li>
                <span>
                  <a onClick={() => handleTabClick('jobs')} style={{ paddingLeft: '24px', fontSize: '24px', color: activeTab === 'jobs' ? 'purple' : 'gray', cursor: 'pointer' }}>
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

            {activeTab === 'overview' && (<CompanyOverView companyId={companyId} />)}
            {activeTab === 'jobs' && (
              <CompanyJobs companyId={companyId} />
            )}
          </Col>
          <Col xs={4}>
            <Card className='key-stats'>
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
                      <h5>HR mapped : Yes</h5>
                    ) : (
                      <h5>HR mapped : No</h5>
                    )}
                    <h5>Total HR's: {countOfHR}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total Jobs: {countOfTotalJobs}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Total Active Jobs: {countOfJobs}</li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                      <li>Top Searched Job: Software Engineer</li>
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

    </div>
  );
};

export default EachCompanyPage;
