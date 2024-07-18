import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
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
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

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
      setCompany(response.data);
      setLogo(response.data.logo); // Assuming logo is fetched from company data
      setBanner(response.data.banner); // Assuming banner is fetched from company data
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

  const navigateToHRSignin = () => {
    if (company) {
      navigate('/signin');
    }
  };

  const handleBack = () => {
    navigate("/jobdbcompanies"); // Navigate back to previous page
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container fluid className='dashboard-container' style={{ background: '#f2f2f2', minHeight: '100vh' }}>

      <Col style={{ overflowY: 'scroll' }}>
        <Card style={{ width: '100%', height: '25%' }}>
          <Card.Body>
            <Row>
              <Col style={{ height: '70px', width: '10%' }}>
                <h2 className='text-start' data-text={company ? company.companyName : ''}>{company ? company.companyName : ''}</h2>
                <div className="icon-box">
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="logo-image" style={{ width: '180px', height: '180px', marginTop: '30px' }} />
                  ) : (
                    <img src="https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"
                      alt="Company Logo" className="logo-image" style={{ width: '180px', height: '180px', marginTop: '30px' }} />
                  )}
                </div>
              </Col>
              <Col xs={4} className="text-end">
                <div className="icon-box" style={{ width: '100%' }}>
                  {banner ? (
                    <img src={banner} alt="Company Banner" className="banner-image" style={{ width: '100%', height: 'auto' }} />
                  ) : (
                    <img src="https://img.freepik.com/free-vector/abstract-black-color-geometric-banner-design_1055-8759.jpg"
                      alt="Company Banner" className="banner-image" style={{ width: '100%', height: 'auto' }} />
                  )}
                </div>

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
            {activeTab === 'overview' && (
              <div>
                <Card onClick={() => handleTabClick('overview')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                  <Card.Body>
                    <h3>About {company ? company.companyName : ''}</h3>
                    <p>Click to view Overview content...</p>
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
                    <Button variant="primary" style={{ marginRight: "12px" }} onClick={navigateToHRSignin}>Claim/Login</Button>
                    <Button variant="success">Apply</Button>
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

    </Container>
  );
};

export default EachCompanyPage;
