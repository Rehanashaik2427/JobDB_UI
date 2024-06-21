import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';
import { Dropdown } from 'react-bootstrap';

const HrProfile = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const userName = location.state?.userName || '';
  const userEmail = location.state?.userEmail || '';
  const [showSettings, setShowSettings] = useState(false);

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
  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

  return (
    <div className='hr-dashboard-container'>
      <div className='hr-leftside'>
        <HrLeftSide user={{ userName: userName, userEmail: userEmail }} />
      </div>

      <div className='rightside'>
      <div className="d-flex justify-content-end">
      <div className="candidate-search">
        <div className="user col px-3">
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
         </div>
       </div>
        <div>
          <div className="profile-container">
            {userData && (
              <>
                <div className="profile-item">
                  <span className="profile-label">Name:</span>
                  <span className="profile-value">{userData.userName}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{userData.userEmail}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">PhoneNumber:</span>
                  <span className="profile-value">{userData.phone}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrProfile;
