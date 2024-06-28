import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

  console.log(userName);
  console.log(userData);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getUserName`, {
        params: {
          userId: userId
        }
      });

      console.log(response.data);


      setUserName(response.data.userName);


      setUserData(response.data);

    } catch (error) {

      setUserData(null);
    }
  };

  useEffect(() => {

    fetchUserData(userId);

  }, [userId]);



  const [countOfCompanies, setCountOfCompanies] = useState(null);
  const fetchApplicationsCompanies = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCountOfAppliedCompany`, {
        params: {
          userId: userId
        }
      });

      console.log(response.data);
      setCountOfCompanies(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setCountOfCompanies(null);
    }
  };
  useEffect(() => {

    fetchApplicationsCompanies(userId);

  }, [userId]);

  const [countOfResume, setCountOfResumes] = useState(null);
  const fetchCountResumes = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCountOfResumes`, {
        params: {
          userId: userId
        }
      });

      console.log(response.data);
      setCountOfResumes(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setCountOfCompanies(null);
    }
  };
  useEffect(() => {

    fetchCountResumes(userId);

  }, [userId]);

  const [countOfTotalCompanies, setCountOfTotalCompanies] = useState(null);
  const fetchTotalCompanies = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCountOfTotalCompany`);

      console.log(response.data);
      setCountOfTotalCompanies(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setCountOfTotalCompanies(null);
    }
  };
  useEffect(() => {

    fetchTotalCompanies();

  }, []);


  const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState(null);
  const fetchTotalShortlistedApplications = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCountOfTotalShortlistedApplication`, {
        params: {
          userId: userId
        }
      });

      console.log(response.data);
      setCountOfshortlistedApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setCountOfshortlistedApplications(null);
    }
  };
  useEffect(() => {
    fetchTotalShortlistedApplications(userId);

  }, [userId]);

  console.log(userId);


  const toggleSettings = () => {
    navigate('/');
  };


  const user = {
    userName: userName,
    userId: userId,
  };
  return (
    <div className='dashboard-container'>
    <div className='left-side'>
      <CandidateLeftSide user={user} />
    </div>

    <div className='rightside'>
        <Container className="top-right-content ">
          <Row className=" d-flex justify-content-end ">

            <Col xs={4} md={1}>
            <div className="user col px-3 header-part-right" style={{marginTop:'10px'}}>
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
            </Col>
          </Row>
        </Container>



        <Container className="my-dashboard-container ">
          <h3 className='status-info' style={{marginTop:'10px'}}>My application status</h3>
          <Row className="dashboard d-flex mt-4">
            <Col xs={3} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px',marginLeft:'20px'}}>
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

            <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data"style={{ maxHeight: '150px', maxWidth: '150px' }}>
              <Link
                to={{
                  pathname: '/my-application',
                  state: { userName: userName, userId: userId, applicationStatus: "Shortlisted" }
                }}
              >
                <h4>{countOfshortlistedApplications !== null ? countOfshortlistedApplications : 'Loading...'}</h4>
                <h4>shortlist</h4>
              </Link>
            </Col>
            <Col xs={6} md={4} className="d-flex flex-column justify-content-center align-items-center data" style={{ maxHeight: '150px', maxWidth: '150px' , textAlign:'center',marginRight:'20px' }}>
              <Link
                to={{
                  pathname: '/candidate-companies',
                  state: { userName: userName, userId: userId }
                }}  onClick={(e) => {
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
          </div>
          </div>
        
  );
};

export default CandidateDashboard;
