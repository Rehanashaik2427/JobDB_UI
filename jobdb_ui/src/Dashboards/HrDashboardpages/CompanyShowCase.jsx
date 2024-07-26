import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { FaBars, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
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
  const [activeTab, setActiveTab] = useState('home'); // State to control the active tab
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
    facebooklonk: '',
    twitterlink: '',
    instagramlink: '',
    linkedinLink: ''
  });


  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
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
      const { facebooklonk, twitterlink, instagramlink, linkedinLink } = response.data;
      setSocialMediaLinks({
        facebooklonk,
        twitterlink,
        instagramlink,
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
        facebooklonk: socialMediaLinks.facebooklonk,
        twitterlink: socialMediaLinks.twitterlink,
        instagramlink: socialMediaLinks.instagramlink,
        linkedinLink: socialMediaLinks.linkedinLink
      });

      // Update the state with the new links
      setSocialMediaLinks({
        facebooklonk: socialMediaLinks.facebooklonk,
        twitterlink: socialMediaLinks.twitterlink,
        instagramlink: socialMediaLinks.instagramlink,
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
      <div className="hamburger-icon" onClick={toggleLeftSide}>
        <FaBars />
      </div>
      <div className="rightside" style={{ overflowY: 'scroll' }}>
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
                style={{ width: '200px', height: '120px', cursor: 'pointer', border: '5px solid white', borderRadius: '50%' }}
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
            <div>
              <h1 style={{ position: 'absolute', top: '65%', right: '100px' }}>{userData.companyName}</h1>

              <div className='social-icons-company' style={{ position: 'absolute', top: '80%', left: '920px' }}>

                <div className="social-media-buttons">
                  <Button variant="primary" onClick={setShowModal}>Add Social Media Links</Button>
                </div>
                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Social Media Links</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId='facebooklonk'>
                        <Form.Label>Facebook</Form.Label>
                        <Form.Control
                          type='text'
                          name='facebooklonk'
                          value={socialMediaLinks.facebooklonk}
                          onChange={handleInputChange}
                          placeholder='Enter Facebook link'
                        />
                      </Form.Group>
                      <Form.Group controlId='twitterlink'>
                        <Form.Label>Twitter</Form.Label>
                        <Form.Control
                          type='text'
                          name='twitterlink'
                          value={socialMediaLinks.twitterlink}
                          onChange={handleInputChange}
                          placeholder='Enter Twitter link'
                        />
                      </Form.Group>
                      <Form.Group controlId='instagramlink'>
                        <Form.Label>Instagram</Form.Label>
                        <Form.Control
                          type='text'
                          name='instagramlink'
                          value={socialMediaLinks.instagramlink}
                          onChange={handleInputChange}
                          placeholder='Enter Instagram link'
                        />
                      </Form.Group>
                      <Form.Group controlId='linkedinLink'>
                        <Form.Label>LinkedIn</Form.Label>
                        <Form.Control
                          type='text'
                          name='linkedinLink'
                          value={socialMediaLinks.linkedinLink}
                          onChange={handleInputChange}
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
                <div className="social-media-icons">
                  {socialMediaLinks.facebooklonk && (
                    <a href={socialMediaLinks.facebooklonk} target="_blank" rel="noopener noreferrer">
                      <FaFacebook size={24} style={{ margin: '0 5px', color: '#3b5998' }} />
                    </a>
                  )}
                  {socialMediaLinks.twitterlink && (
                    <a href={socialMediaLinks.twitterlink} target="_blank" rel="noopener noreferrer">
                      <FaTwitter size={24} style={{ margin: '0 5px', color: '#1da1f2' }} />
                    </a>
                  )}
                  {socialMediaLinks.instagramlink && (
                    <a href={socialMediaLinks.instagramlink} target="_blank" rel="noopener noreferrer">
                      <FaInstagram size={24} style={{ margin: '0 5px', color: '#e4405f' }} />
                    </a>
                  )}
                  {socialMediaLinks.linkedinLink && (
                    <a href={socialMediaLinks.linkedinLink} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin size={24} style={{ margin: '0 5px', color: '#0077b5' }} />
                    </a>
                  )}
                </div>

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
                    <h3>About {userData.companyName}</h3>
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
            {activeTab === 'overview' && <CompnayOverview style={{ overflowY: 'scroll' }} />}
            {activeTab === 'jobs' && <CompanyJobs />}
          </Col>
          <Col xs={4}>
            <Card style={{ height: '90%', marginTop: '5px', marginRight: '30px' }} className='key-stats'>
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
                      {/* <li>Top Searched Job: Software Engineer</li>
                        <li>User Engagement: 75% daily active users</li> */}
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


