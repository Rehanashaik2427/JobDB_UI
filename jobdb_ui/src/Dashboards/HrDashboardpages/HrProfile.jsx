import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HrLeftSide from './HrLeftSide';
const HrProfile = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const [userData,setUserData]=useState({});

  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;


  const user = {
    userName: userName,
    userEmail: userEmail,
    
  };

  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };


  const getUser = async (userEmail) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    getUser(userEmail);
  },[userEmail]);
  return (
    <div className='hr-dashboard-container'>
      <div className='hr-leftside'>
        <HrLeftSide user={user} />
      </div>

      <div className='rightside'>
      <div className="top-right-content"> 
        <div className="candidate-search">
          <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>
        </div>
      </div>
      {showSettings && (
       <div id="modal-container">
       <div id="settings-modal">
          {/* Your settings options here */}
          <ul>
            <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sing out</Link></li>
            <li>Setting </li>
            {/* Add more settings as needed */}
          </ul>
          <button onClick={toggleSettings}>Close</button>
        </div>
        </div>
      )}
  <div>
    <div className="profile-container">
        {user && (
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
  )
}

export default HrProfile;
