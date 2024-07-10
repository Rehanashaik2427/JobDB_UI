import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Chart from 'react-apexcharts';
import CandidateLeftSide from './CandidateLeftSide';

const CandidateDashboard = () => {
  const location = useLocation();
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  // const userName=location.state.userName;
  const userId = location.state?.userId;
  console.log(userId);
  const navigate = useNavigate();

  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState();

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getUserName`, {
        params: {
          userId: userId
        }
      });
      console.log(response.data);
      setUserName(response.data.userName);
      localStorage.setItem(`userName_${userId}`, response.data.userName); // Store userName with user-specific key
      setUserData(response.data);
    } catch (error) {

      setUserData(null);
    }
  };

  useEffect(() => {
    if (!userName && userId) {
      fetchUserData(userId);
    }

  }, [userId, userName]);
  useEffect(() => {
    const storedUserName = localStorage.getItem(`userName_${userId}`);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [userId]);

  const [countOfResume, setCountOfResumes] = useState(null);
  const [countOfCompanies, setCountOfCompanies] = useState(null);
  const [countOfTotalCompanies, setCountOfTotalCompanies] = useState(null);
  const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState(null);

  useEffect(() => {
    fetchData(userId);
  }, [userId]);


  const fetchData = async (userId) => {
    try {
      const countCompanies = await axios.get(`${BASE_API_URL}/getCountOfAppliedCompany`, {
        params: {
          userId: userId
        }
      });
      console.log(countCompanies.data);
      setCountOfCompanies(countCompanies.data);

      const countResumes = await axios.get(`${BASE_API_URL}/getCountOfResumes`, {
        params: {
          userId: userId
        }
      });
      console.log(countResumes.data);
      setCountOfResumes(countResumes.data);

      const totalCompanies = await axios.get(`${BASE_API_URL}/getCountOfTotalCompany`);
      console.log(totalCompanies.data);
      setCountOfTotalCompanies(totalCompanies.data);

      const shortlist = await axios.get(`${BASE_API_URL}/getCountOfTotalShortlistedApplication`, {
        params: {
          userId: userId
        }
      });
      console.log(shortlist.data);
      setCountOfshortlistedApplications(shortlist.data);

    } catch (error) {
      console.error('Error fetching Data:', error);
      setCountOfCompanies(null);
    }
  };



  const toggleSettings = () => {
    navigate('/');
  };
  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };
  const [countOfUnreadNotification, setCountOfUnreadNotification] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);

  const fetchTotalUnreadNotification = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getUnreadNotifications`, {
        params: {
          userId: userId
        }
      });

      console.log(response.data);
      setCountOfUnreadNotification(response.data.count);
      setUnreadNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setCountOfUnreadNotification(0);
      setUnreadNotifications([]);
    }
  };

  useEffect(() => {
    fetchTotalUnreadNotification(userId);
  }, [userId]);



  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.post(`${BASE_API_URL}/markNotificationsAsRead`, null, {
        params: { userId: userId, notificationId: notificationId }
      });
      // Update state to reflect the notification as read
      const updatedNotifications = unreadNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      setUnreadNotifications(updatedNotifications);
      setCountOfUnreadNotification(prevCount => prevCount - 1); // Decrease unread count
    } catch (error) {
      console.error('Error marking notification as read:', error);
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

  const initials = getInitials(user.userName);

  useEffect(() => {
    fetchApplicationsData(userId);
  }, [userId]);

  const fetchApplicationsData = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/countByDate`, {
        params: { userId }
      });
      setApplicationsData(response.data);
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  const options = {
    chart: {
      id: 'chart1',
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: applicationsData.map(data => new Date(data.date).toISOString()),
    },
    yaxis: {
      min: 0,
      max: 50,
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return parseInt(val, 10);
        }
      }
    },
    series: [{
      name: 'Applications',
      data: applicationsData.map(data => data.count),
    }],
  };
  


  return (
    <Container fluid className='dashboard-container'>
      <Row>
        <Col md={2} className="left-side">
          <CandidateLeftSide user={user} />
        </Col>

        <Col md={18} className="rightside" style={{
          overflow: 'hidden'
        }}>

          <div className="d-flex justify-content-end align-items-center mb-3 mt-12 ml-2">
            <i
              datafullscreen="true"
              onClick={toggleFullScreen}
              className="i-Full-Screen header-icon d-none d-lg-inline-block"
              style={{ fontSize: '20px', marginRight: '12px' }}
            />



            <Dropdown className="ml-2">
              <Dropdown.Toggle
                as="div"
                id="dropdownNotification"
                className="badge-top-container toggle-hidden ml-2"
              >
                <span className="badge bg-primary cursor-pointer">
                  {countOfUnreadNotification}
                </span>
                <i className="i-Bell text-muted header-icon" style={{ fontSize: '22px' }} />
              </Dropdown.Toggle>

              {countOfUnreadNotification > 0 ? (
                <Dropdown.Menu>
                  {unreadNotifications.length === 0 ? (
                    <Dropdown.Item>No new notifications</Dropdown.Item>
                  ) : (
                    unreadNotifications.map((notification, index) => (
                      <Dropdown.Item key={index} onClick={() => markNotificationAsRead(notification.id)} style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.message}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              ) : null}
            </Dropdown>




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



          <Container className="my-dashboard-container ">
            <h3 className='status-info' style={{ marginTop: '10px' }}>My application status</h3>
            <Row className="dashboard d-flex mt-4">
              <Col xs={3} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px', marginLeft: '20px' }}>
                <Link
                  to={{
                    pathname: '/candidate-companies',
                    state: { userName: userName, userId: userId }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/candidate-companies', { state: { userName, userId } });
                  }}
                >
                  <h5>Applied to</h5>
                  <h4>{countOfCompanies !== null ? countOfCompanies : 'Loading...'}</h4>
                  <h5>companies</h5>
                </Link>
              </Col>
              <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px' }}>
                <Link
                  to={{
                    pathname: '/resume',
                    state: { userName: userName, userId: userId }
                  }} onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/resume', { state: { userName, userId } });
                  }}
                >
                  <h4>{countOfResume !== null ? countOfResume : 'Loading...'}</h4>
                  <h5>resumes</h5>
                </Link>
              </Col>
              <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px' }}>
                <h1>250</h1>
                <h4>resume views</h4>
              </Col>

              <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px' }}>
                <Link
                  to={{
                    pathname: '/candidate-dashboard/my-application',
                    state: { userName: userName, userId: userId, applicationStatus: "Shortlisted" }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/my-application', { state: { userName, userId, applicationStatus: "Shortlisted" } });
                  }}
                >
                  <h4>{countOfshortlistedApplications !== null ? countOfshortlistedApplications : 'Loading...'}</h4>
                  <h4>shortlist</h4>
                </Link>
              </Col>
              <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px', textAlign: 'center', marginRight: '20px' }}>
                <Link
                  to={{
                    pathname: '/candidate-companies',
                    state: { userName: userName, userId: userId }
                  }} onClick={(e) => {
                    e.preventDefault();
                    navigate('/candidate-dashboard/candidate-companies', { state: { userName, userId } });
                  }}
                >
                  <h4 className='text-align-center'>{countOfTotalCompanies !== null ? countOfTotalCompanies : 'Loading...'}</h4>
                  <h5 className='text-align-center'>companies</h5>
                </Link>

              </Col>
            </Row>
          </Container>
          <Row className="justify-content-center">
            <Col md={5} xs={16} className="mb-4">
              <Card body className="h-100 chart-card" style={{ width: '100%' }}>
                <Card.Title className="text-center">Applications per Day</Card.Title>
                <Chart options={options} series={options.series} type={options.chart.type} />
              </Card>
            </Col>
          </Row>

        </Col>
      </Row>
    </Container>

  );
};

export default CandidateDashboard;
