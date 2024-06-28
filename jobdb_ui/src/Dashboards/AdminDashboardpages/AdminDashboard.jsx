import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stomp } from '@stomp/stompjs';

const AdminDashboard = () => {
  const [validatedCompaniesCount, setValidatedCompaniesCount] = useState(0);
  const [validatedHrCount, setValidatedHrCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      const hrResponse = await axios.get('http://localhost:8082/api/jobbox/countofHrs');
      setHrCount(hrResponse.data); // Update hrCount state with fetched HR count

      const companiesResponse = await axios.get('http://localhost:8082/api/jobbox/countOfCompanies');
      setCompanyCount(companiesResponse.data); // Update companyCount state with fetched company count
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const totalNotifications = hrCount + companyCount;


 useEffect(() => {
    fetchValidatedCompaniesCount();
    fetchValidatedHrCount();
    fetchCounts();
    connectWebSocket();
  }, []);


  const fetchValidatedCompaniesCount = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/jobbox/countValidatedCompanies');
      setValidatedCompaniesCount(response.data);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const fetchValidatedHrCount = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/jobbox/countValidatedUsers');
      setValidatedHrCount(response.data);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/notifications', (message) => {
        const notification = message.body;

        // Use a Set to track unique notifications
        setNotifications((prevNotifications) => {
          const updatedNotifications = new Set([...prevNotifications, notification]);
          return Array.from(updatedNotifications); // Convert Set back to an array
        });
      });
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
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
      <div className='leftside'>
        <AdminleftSide />
      </div>

      <div className="rightSide">
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
              <span className="badge bg-primary cursor-pointer">{totalNotifications}</span>
              <i className="i-Bell text-muted header-icon" style={{ fontSize: '22px' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/admin-dashboard/admin-action">
                {hrCount} new HRs
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin-dashboard/company-validation"> {companyCount} new companies</Dropdown.Item>

              
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
            company validated
          </span>
          <span>
            <h2>{validatedHrCount}</h2>
            HR validated
          </span>
          <span>
            <h3>Allowing access to HR</h3>
            <h3>for Job Posting</h3>
          </span>
          <span>
            <h3>Allowing access to Candidate</h3>
            <h3>for Applying Jobs</h3>
          </span>
          <span>
            <h2>200+</h2>
            HR Blocked
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
      </div>
    </div>
  );
}

export default AdminDashboard;
