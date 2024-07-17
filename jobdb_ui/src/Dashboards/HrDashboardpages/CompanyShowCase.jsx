import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import CompanyJobs from './CompanyJobs'
import CompanyOverview from './CompnayOverview'
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
  // const [countOfJobs, setCountOfJobs] = useState(0);
  const [countOfActiveJobs, setCountOfActiveJobs] = useState();
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);


  const [logoUrl, setLogoUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const { companyName } = userData;
  console.log(companyName)

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    console.log(file);
    if (type === 'logo') {
      setLogo(file);
      handleSubmit();
    } 
    if (type === 'banner') {
      setBanner(file);
      handleSubmit();
    }
  };
  const handleClick = (type) => {
    document.getElementById(`${type}Input`).click();
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
      countofApplicantsInCompany(userEmail);
      // totalJobsofCompany(userEmail)
      countOfActiveJobsInCompany(userEmail)
      countOfSHortlistedCandidatesInCompany(userEmail)

    }
  }, [userEmail]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const countOfHRSInCompany = async () => {
    console.log(companyName)
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfHRSInCompany?companyName=${companyName}`);
      console.log("Response from countOfHRSInCompany API:", response.data); // Log response for debugging
      setCountOfHR(response.data);
    } catch (error) {
      console.error("Error fetching count of HRs:", error); // Log any errors
    }
  }

  const countofApplicantsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfApplications(response.data);
    }
    catch (error) {
      console.error('Error fetching counts:', error);
    }
  }

  useEffect(() => {
    countOfHRSInCompany();
  },);

  // const totalJobsofCompany = async (userEmail) =>{
  //   try{
  //   const response =  await axios.get(`${BASE_API_URL}/totalJobsofCompany`, {
  //     params: { userEmail: userEmail }
  //   });
  //   setCountOfJobs(response.data);
  // }
  // catch (error) {
  //   console.error('Error fetching counts:', error);
  // }
  // }

  const countOfActiveJobsInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfActiveJobs(response.data);
    }
    catch (error) {
      console.error('Error fetching counts:', error);
    }
  }

  const countOfSHortlistedCandidatesInCompany = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany`, {
        params: { userEmail: userEmail }
      });
      setCountOfShortlistedCandiCompany(response.data);
    }
    catch (error) {
      console.error('Error fetching counts:', error);
    }
  }
 
   

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('companyName', userData.companyName);
    if (logo) {
      formData.append('logo', logo);
    }
   if (banner) {
      formData.append('banner', banner);
    }

    console.log(logo, " ", banner)

    try {
      const response = await axios.post(`${BASE_API_URL}/uploadcompanyLogoBanner`, formData);
      console.log('Response:', response.data);
      // Handle success message or further actions
    } catch (error) {
      console.error('Error updating company details:', error);
    }
  };

  console.log(logo, " ", banner)

console.log(companyName)
  useEffect(() => {
    const fetchLogoAndBanner = async () => {
      console.log(companyName)
      try {
        const response = await axios.get(`${BASE_API_URL}/logoAndBanner?companyName=${companyName}`);
        const [logoData, bannerData] = response.data;

        // Convert byte arrays to base64 URLs
        if (logoData) {
          const logoUrl = `data:image/jpeg;base64,${btoa(
            new Uint8Array(logoData).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )}`;
          setLogoUrl(logoUrl);
        }

        if (bannerData) {
          const bannerUrl = `data:image/jpeg;base64,${btoa(
            new Uint8Array(bannerData).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )}`;
          setBannerUrl(bannerUrl);
        }
      } catch (error) {
        console.error('Error fetching logo and banner:', error);
      }
    };

    if (companyName) {
      fetchLogoAndBanner();
    }
  }, [companyName]);

  
  return (
    // <Container fluid className="dashboard-container">
    <Container fluid className='dashboard-container' style={{ background: '#f2f2f2', minHeight: '100vh' }}>

      <Row>
        <Col md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>
        <Col md={10} className="rightside" style={{ overflowY: 'scroll' }}>
          <Card style={{ width: '100%', height: '25%' }}>
            <Card.Body>
              <Row>
                <Col style={{ height: '70px', width: '10%' }}>
                  <h2 className='text-start' data-text='Company Name'>{userData.companyName}</h2>
                  <div className="icon-box" onClick={() => handleClick('logo')}>
                    {logo ? (
                      <img src={logo} alt="Company Logo" className="logo-image" style={{ width: '180px', height: '180px', marginTop: '30px' }} />
                    ) : (
                      <img src="https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"
                        alt="Company Logo" className="logo-image" style={{ width: '180px', height: '180px', marginTop: '30px' }} />
                    )}
                    <FontAwesomeIcon icon={faCamera} size="2x" className="camera-icon" />
                  </div>
                  <input type="file" id="logoInput" onChange={(e) => handleFileChange(e, 'logo')} style={{ display: 'none' }} />
                </Col>
                <Col xs={4} className="text-end">
                  <div className="icon-box" onClick={() => handleClick('banner')}>
                    {banner ? (
                      <img src={banner} alt="Company Banner" className="banner-image" style={{ width: '100%', height: '25%' }} />
                    ) : (
                      <h1 className='text-center'>Company Banner</h1>
                    )}
                    <FontAwesomeIcon icon={faCamera} size="2x" className="camera-icon" />
                  </div>
                  <input type="file" id="bannerInput" onChange={(e) => handleFileChange(e, 'banner')} style={{ display: 'none' }} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card style={{ marginTop: '50px', height: '8%' }}>
            <Card.Body>
              <ul className="nav-links d-flex" style={{ paddingLeft: '24px', listStyleType: 'none' }}>
                <li>
                  <span>
                    <a onClick={() => handleTabClick('overview')} style={{ paddingLeft: '24px', color: activeTab === 'overview' ? 'purple' : 'gray', cursor: 'pointer' }}>
                      About
                    </a>
                  </span>
                </li>

                <li>
                  <span>
                    <a onClick={() => handleTabClick('jobs')} style={{ paddingLeft: '24px', color: activeTab === 'jobs' ? 'purple' : 'gray', cursor: 'pointer' }}>
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
              {activeTab === 'overview' && <CompanyOverview />}
              {activeTab === 'jobs' && <CompanyJobs />}
            </Col>
            <Col >
              <Card style={{ height: '100%' }}>
                <Card.Body>
                  <Row className="mb-3">
                    <Col >
                      <Button variant="primary" style={{ marginRight: "12px" }}>Claim/Login</Button>
                      <Button variant="success">Apply</Button>
                    </Col>
                  </Row>

                  {/* <Row className="mb-2">
                    <Col>
                      <h5>Total Jobs:{countOfJobs}</h5>
                    </Col>
                  </Row> */}
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
      </Row>
    </Container>
  )
}

export default CompanyShowCase
