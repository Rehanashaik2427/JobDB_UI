import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import CompanyJobs from './CompanyJobs'
import CompnayOverview from './CompnayOverview'
import HrLeftSide from './HrLeftSide'


const CompanyShowCase = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [showLeftSide, setShowLeftSide] = useState(false);
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  const [activeTab, setActiveTab] = useState('overview'); // State to control the active tab
  const [userData, setUserData] = useState({});
  const [countOfHr, setCountOfHR] = useState();
  const [countOfApplications, setCountOfApplications] = useState(0);
  const [countOfActiveJobs, setCountOfActiveJobs] = useState();
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
  const [countOfDreamApplicationsInCompany, setCountOfDreamApplicationsInCompany] = useState(0);
  const [companyName, setCompanyName] = useState('');

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
      countofApplicantsInCompany(userEmail);
      countOfActiveJobsInCompany(userEmail);
      countOfShortlistedCandidatesInCompany(userEmail);
      countOfDreamApplications(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userData.companyName) {
      fetchCompanyLogo(userData.companyName);
      fetchCompanyBanner(userData.companyName);
      countOfHRSInCompany(userData.companyName);
      fetchSocialMediaLinks(userData.companyName)
    }
  }, [userData.companyName]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
      setCompanyName(response.data.companyName);
    } catch (error) {
      console.log(error);
    }
  };
  // const {companyName} = userData.companyName


  useEffect(() => {
    if (companyName) {
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);


    }
  }, [companyName])



  const countOfHRSInCompany = async () => {
    console.log(companyName)

    try {
      const response = await axios.get(`${BASE_API_URL}/countOfHRSInCompany?companyName=${companyName}`);
      console.log("Response from countOfHRSInCompany API:", response.data); // Log response for debugging
      setCountOfHR(response.data);
    } catch (error) {
      console.error("Error fetching count of HRs:", error); // Log any errors
    }
  };

  const countofApplicantsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfApplications(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfActiveJobsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfActiveJobs(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfShortlistedCandidatesInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfShortlistedCandiCompany(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const countOfDreamApplications = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfDreamApplications`, {
        params: { userEmail: userEmail }
      });
      setCountOfDreamApplicationsInCompany(response.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = async (type, file) => {
    const formData = new FormData();
    formData.append('companyName', userData.companyName);
    formData.append('file', file);

    try {
      const response = await axios.post(
        type === 'logo' ? `${BASE_API_URL}/uploadLogo` : `${BASE_API_URL}/uploadBanner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          setCompanyLogo(reader.result);
        } else {
          setCompanyBanner(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleCameraIconClick = (type) => {
    document.getElementById(`${type}Input`).click();
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

  const [showModal, setShowModal] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: ''
  });


  const handleCloseModal = () => setShowModal(false);

  const handleSocialInputChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

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
  const handleSaveLinks = async () => {
    try {
      // Save the updated social media links
      await axios.put(`${BASE_API_URL}/updateSocialMediaLinks?companyName=${userData.companyName}`, {
        facebookLink: socialMediaLinks.facebookLink,
        twitterLink: socialMediaLinks.twitterLink,
        instagramLink: socialMediaLinks.instagramLink,
        linkedinLink: socialMediaLinks.linkedinLink
      });

      // Update the state with the new links
      setSocialMediaLinks({
        facebookLink: socialMediaLinks.facebookLink,
        twitterLink: socialMediaLinks.twitterLink,
        instagramLink: socialMediaLinks.instagramLink,
        linkedinLink: socialMediaLinks.linkedinLink
      });

      handleCloseModal(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating social media links:', error.response ? error.response.data : error.message);
    }
  };


  return (
    // <Container fluid className="dashboard-container">
    <div className='dashboard-container' style={{ background: '#f2f2f2', minHeight: '100vh' }}>
      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <HrLeftSide user={{ userName, userEmail }} />
      </div>


      <div className="right-side">
        <Card style={{ width: '100%', height: '60%' }}>
          <Card.Body style={{ padding: 0, position: 'relative' }}>
            <div style={{ position: 'relative', height: '55%' }}>
              <img
                src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                alt="Company Banner"
                className="banner-image"
                onClick={() => handleCameraIconClick('banner')}
                style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <input
                id="bannerInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('banner', e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{
                  width: '18vw', // Adjust width to 20% of viewport width
                  height: 'auto', // Maintain aspect ratio
                  maxWidth: '200px', // Optional: max-width to avoid it growing too large
                  cursor: 'pointer',
                  border: '5px solid white',
                  borderRadius: '50%',
                  objectFit: 'cover', // Ensure the image covers the given width and height without distortion
                }}
                onClick={() => handleCameraIconClick('logo')}
              />
              <input
                id="logoInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('logo', e.target.files[0])}
                accept="image/*"
              />
            </div>
              <divs>
              <h1 style={{ position: 'absolute', top: '60%', right: '100px' }}>{userData.companyName}</h1>
              <div className='social-icons-company' style={{ position: 'absolute', top: '70%', right: '60px', zIndex: 10 }}>
                <Button variant="primary" onClick={setShowModal}>Add Social Media Links</Button>
                <br />
                {socialMediaLinks.facebookLink && (
                  <a href={socialMediaLinks.facebookLink} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={24} style={{ margin: '0 5px', color: '#3b5998' }} />
                  </a>
                )}
                {socialMediaLinks.twitterLink && (
                  <a href={socialMediaLinks.twitterLink} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={24} style={{ margin: '0 5px', color: '#1da1f2' }} />
                  </a>
                )}
                {socialMediaLinks.instagramLink && (
                  <a href={socialMediaLinks.instagramLink} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={24} style={{ margin: '0 5px', color: '#e4405f' }} />
                  </a>
                )}
                {socialMediaLinks.linkedinLink && (
                  <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={24} style={{ margin: '0 5px', color: '#0077b5' }} />
                  </a>
                )}
              </div>
            </divs>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add Social Media Links</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId='facebookLink'>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type='text'
                      name='facebookLink'
                      value={socialMediaLinks.facebookLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Facebook link'
                    />
                  </Form.Group>
                  <Form.Group controlId='twitterLink'>
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      type='text'
                      name='twitterLink'
                      value={socialMediaLinks.twitterLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Twitter link'
                    />
                  </Form.Group>
                  <Form.Group controlId='instagramLink'>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      type='text'
                      name='instagramLink'
                      value={socialMediaLinks.instagramLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter Instagram link'
                    />
                  </Form.Group>
                  <Form.Group controlId='linkedinLink'>
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      type='text'
                      name='linkedinLink'
                      value={socialMediaLinks.linkedinLink}
                      onChange={handleSocialInputChange}
                      placeholder='Enter LinkedIn link'
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant='primary' onClick={handleSaveLinks}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <div
              style={{
                position: 'absolute',
                top: '80%',
                left: '5%', // Adjusted to be responsive
                transform: 'translateX(-5%)', // Centered horizontally relative to the left margin
                width: '90%', // Responsive width
                display: 'flex',
                justifyContent: 'flex-start', // Align items to the start (left side)
                overflowX: 'auto', // Allow horizontal scroll if needed
                boxSizing: 'border-box',
              }}
            >
              <ul
                className="nav-links"
                style={{
                  listStyleType: 'none',
                  display: 'flex',
                  margin: 0,
                  padding: 0,
                  flexWrap: 'wrap', // Wrap items to fit smaller screens
                }}
              >
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('overview')}
                      style={{
                        paddingLeft: '2vw', // Responsive padding
                        fontSize: '2vw', // Responsive font size
                        color: activeTab === 'overview' ? 'purple' : 'gray',
                        cursor: 'pointer',
                      }}
                    >
                      About
                    </a>
                  </span>
                </li>

                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('jobs')}
                      style={{
                        paddingLeft: '2vw', // Responsive padding
                        fontSize: '2vw', // Responsive font size
                        color: activeTab === 'jobs' ? 'purple' : 'gray',
                        cursor: 'pointer',
                      }}
                    >
                      Jobs
                    </a>
                  </span>
                </li>
              </ul>
            </div>

          </Card.Body>
        </Card>

        <Row>
          <Col xs={12} md={8}>

            {activeTab === 'overview' && <CompnayOverview style={{ overflowY: 'scroll' }} />}
            {activeTab === 'jobs' && <CompanyJobs />}
          </Col>
          <Col xs={12} md={4}>
            <Card className='key-stats' style={{ width: '80%', height: 'fit-content' }}>
              <Card.Body>
                <Row className="mb-3">
                  <h1>Other Information</h1>

                </Row>


                <Row className="mb-2">
                  <Col>
                    <h5>Applicants:{countOfApplications}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total HR's:{countOfHr}</h5>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Active Job Postings: {countOfActiveJobs}</li> {/* Placeholder values */}
                      <li>Shortlisted Candidates: {countOfShortlistedCandiCompany}</li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                      <li>Dream Applications: {countOfDreamApplicationsInCompany}</li>

                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CompanyShowCase


