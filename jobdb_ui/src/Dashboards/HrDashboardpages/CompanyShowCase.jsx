import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
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
  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  const [logo, setLogo] = useState(null);

  const handleFileChange = (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };
  useEffect(() => {
    if (userEmail) {
      getUser(userEmail);
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
  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>
        <Col md={10} className="rightside" style={{ overflow: 'scroll' }}>
          <Card style={{ width: '100%', height: '25%' }}>
            <Card.Body>
              <Row>
                <Col className="text-end" xs={1} style={{ width: '15%', height: '150px', margin: '50px' }}>
                  <div className="icon-box" onClick={handleClick}>
                    <img src="https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg" alt="Company Logo" className="logo-image" style={{ width: '1000px', height: '100px' }} />
                    <FontAwesomeIcon icon={faCamera} size="2x" className="camera-icon" />
                  </div>
                </Col>
                <Col style={{ height: '70px', marginTop: '100px', width: '10%' }}>
                  <h2 className='text-start' data-text='Company Name'>{userData.companyName}</h2>
                </Col>
                <Col xs={4} className="text-end">
                  <div className="icon-box" onClick={handleClick}>
                    <FontAwesomeIcon icon={faCamera} size="2x" className="camera-icon" />
                  </div>
                </Col>
              </Row>
              <Form.Group controlId="formFile" className="d-none">
                <Form.Control
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Card.Body>
          </Card>
          <Card style={{ marginTop: '50px', height: '8%' }}>
            <Card.Body>
              <ul className="nav-links d-flex" style={{ paddingLeft: '24px', listStyleType: 'none' }}>
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('home')}
                      style={{ paddingLeft: '24px', color: activeTab === 'home' ? 'purple' : 'gray', cursor: 'pointer' }}
                    >
                      Home
                    </a>
                  </span>
                </li>
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('overview')}
                      style={{ paddingLeft: '24px', color: activeTab === 'overview' ? 'purple' : 'gray', cursor: 'pointer' }}
                    >
                      Overview
                    </a>
                  </span>
                </li>
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('products')}
                      style={{ paddingLeft: '24px', color: activeTab === 'products' ? 'purple' : 'gray', cursor: 'pointer' }}
                    >
                      Products
                    </a>
                  </span>
                </li>
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('posts')}
                      style={{ paddingLeft: '24px', color: activeTab === 'posts' ? 'purple' : 'gray', cursor: 'pointer' }}
                    >
                      Posts
                    </a>
                  </span>
                </li>
                <li>
                  <span>
                    <a
                      onClick={() => handleTabClick('jobs')}
                      style={{ paddingLeft: '24px', color: activeTab === 'jobs' ? 'purple' : 'gray', cursor: 'pointer' }}
                    >
                      Jobs
                    </a>
                  </span>
                </li>
              </ul>
            </Card.Body>
          </Card>
          {activeTab === 'home' && (
            <div>
              <Card onClick={() => handleTabClick('overview')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                <Card.Body>
                  <h3>Overview</h3>
                  <p>Click to view Overview content...</p>
                </Card.Body>
              </Card>
              <Card onClick={() => handleTabClick('products')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                <Card.Body>
                  <h3>Products</h3>
                  <p>Click to view Products content...</p>
                </Card.Body>
              </Card>
              <Card onClick={() => handleTabClick('posts')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                <Card.Body>
                  <h3>Posts</h3>
                  <p>Click to view Posts content...</p>
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
          {activeTab === 'products' && (
            <Card onClick={() => handleTabClick('products')} style={{ cursor: 'pointer', marginTop: '20px' }}>
              <Card.Body>
                <h3>Products</h3>
                <p>Click to view Products content...</p>
              </Card.Body>
            </Card>
          )}
          {activeTab === 'posts' && (
            <Card onClick={() => handleTabClick('posts')} style={{ cursor: 'pointer', marginTop: '20px' }}>
              <Card.Body>
                <h3>Posts</h3>
                <p>Click to view Posts content...</p>
              </Card.Body>
            </Card>
          )}
          {activeTab === 'jobs' && (
            <Card onClick={() => handleTabClick('jobs')} style={{ cursor: 'pointer', marginTop: '20px' }}>
              <Card.Body>
                <h3>Jobs</h3>
                <p>Click to view Jobs content...</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default CompanyShowCase
