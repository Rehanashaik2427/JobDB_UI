import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const AdminDashboard = () => {
  const [validatedCompaniesCount, setValidatedCompaniesCount] = useState(0);
  const [validatedHrCount, setValidatedHrCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [combinedData, setCombinedData] = useState({
    labels: [],
    datasets: [
      {
        label: 'User %',
        backgroundColor: 'skyblue',
        borderColor: 'black',
        borderWidth: 1,
        hoverBackgroundColor: 'skyblue',
        hoverBorderColor: 'black',
        data: []
      },
      {
        label: 'Company %',
        backgroundColor: 'lightgreen',
        borderColor: 'black',
        borderWidth: 1,
        hoverBackgroundColor: 'lightgreen',
        hoverBorderColor: 'black',
        data: []
      }
    ]
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const hrResponse = await axios.get('http://localhost:8082/api/jobbox/countofHrs');
      setHrCount(hrResponse.data);

      const companiesResponse = await axios.get('http://localhost:8082/api/jobbox/countOfCompanies');
      setCompanyCount(companiesResponse.data);

      const validatedCompaniesResponse = await axios.get('http://localhost:8082/api/jobbox/countValidatedCompanies');
      setValidatedCompaniesCount(validatedCompaniesResponse.data);

      const validatedHrResponse = await axios.get('http://localhost:8082/api/jobbox/countValidatedUsers');
      setValidatedHrCount(validatedHrResponse.data);

      const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const userResponse = await axios.get('http://localhost:8082/api/jobbox/countValidateUsersByMonth');
      const userDataFromApi = allMonths.map((month, index) => userResponse.data[index + 1] || 0);

      const companyResponse = await axios.get('http://localhost:8082/api/jobbox/countValidateCompaniesByMonth');
      const companyDataFromApi = allMonths.map((month, index) => companyResponse.data[index + 1] || 0);

      setCombinedData({
        labels: allMonths,
        datasets: [
          {
            label: 'User %',
            backgroundColor: 'skyblue',
            borderColor: 'black',
            borderWidth: 1,
            hoverBackgroundColor: 'skyblue',
            hoverBorderColor: 'black',
            data: userDataFromApi
          },
          {
            label: 'Company %',
            backgroundColor: 'lightgreen',
            borderColor: 'black',
            borderWidth: 1,
            hoverBackgroundColor: 'lightgreen',
            hoverBorderColor: 'black',
            data: companyDataFromApi
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleFullScreen = () => {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  const toggleSettings = () => {
    navigate('/');
  };

  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <AdminleftSide />
      </div>

      <div className="rightside">
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
              className="badge-top-container toggle-hidden ml-2">
              <span className="badge bg-primary cursor-pointer">{hrCount + companyCount}</span>
              <i className="i-Bell text-muted header-icon" style={{ fontSize: '22px' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/admin-dashboard/admin-action">
                {hrCount} new HRs
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin-dashboard/company-validation">
                {companyCount} new companies
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="ml-2">
            <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
              <FontAwesomeIcon icon={faUser} id="user" className="icon" style={{ color: 'black' }} />
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

        <div className="adminDashboard">
          <span>
            <h2>{validatedCompaniesCount}</h2>
            companies validated
          </span>
          <span>
            <h2>{validatedHrCount}</h2>
            HRs validated
          </span>
          <span>
            <h3>Allowing access to HRs for Job Posting</h3>
          </span>
          <span>
            <h3>Allowing access to Candidates for Applying Jobs</h3>
          </span>
          <span>
            <h2>200+</h2>
            HRs Blocked
          </span>
        </div>

        <div className="applyforValidation">
          <h4>Check for processing User validation!!</h4>
          <p>
            <Link to="/admin-dashboard/admin-action" onClick={(e) => {
              e.preventDefault();
              navigate('/admin-dashboard/admin-action');
            }}>Check</Link>
          </p>
        </div>

        <div className="d-flex flex-column" style={{ height: '100%', width: '100%' }}>
          <Row className="mx-0">
            <Col md={6} className="offset-md-3 mt-4">
              <Card className="shadow-sm rounded-4" >
                <Card.Header className="bg-light text-center">
                  <Card.Title as="h5">Monthly Validation</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Bar
                    data={combinedData}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: {
                            color: '#888',
                            font: {
                              size: 12
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            color: '#888',
                            font: {
                              size: 12
                            },
                            stepSize: 10
                          }
                        }
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
