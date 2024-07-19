import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
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
  // const [countOfJobs, setCountOfJobs] = useState(0);
  const [countOfActiveJobs, setCountOfActiveJobs] = useState();
  const [countOfShortlistedCandiCompany, setCountOfShortlistedCandiCompany] = useState(0);
  const [countOfDreamApplicationsInCompany, setCountOfDreamApplicationsInCompany] = useState(0);

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
      // totalJobsofCompany(userEmail)
      countOfActiveJobsInCompany(userEmail)
      countOfSHortlistedCandidatesInCompany(userEmail)
      countOfDreamApplications(userEmail)
    }
  }, [userEmail]);

  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      const hrData=response.data;
      setUserData(response.data);
      setCompanyName(hrData.companyName);
    } catch (error) {
      console.log(error);
    }
  };



  console.log(companyName)

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

  const countOfDreamApplications = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countOfDreamApplications`, {
        params: { userEmail: userEmail }
      });
      setCountOfDreamApplicationsInCompany(response.data);
    }
    catch (error) {
      console.error('Error fetching counts:', error);
    }
  }

  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Perform validation if needed (size, type, etc.)
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
      // Perform validation if needed (size, type, etc.)
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyBanner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileChange = async (type, file) => {
    const formData = new FormData();
    formData.append('companyName', companyName);
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
              {activeTab === 'overview' && <CompnayOverview />}
              {activeTab === 'jobs' && <CompanyJobs />}
            </Col>
            <Col >
              <Card style={{ height: '100%' }}>
                <Card.Body>
                  <Row className="mb-3">
                    <h1>Other Information</h1>
                    {/* <Col >
                      <Button variant="primary" style={{ marginRight: "12px" }}>Claim/Login</Button>
                      <Button variant="success">Apply</Button>
                    </Col> */}
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
        </Col>
      </Row>
    </Container>
  )
}

export default CompanyShowCase


