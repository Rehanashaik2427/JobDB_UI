import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom

import CandidateLeftSide from './CandidateLeftSide';
import { Dropdown } from 'react-bootstrap';


const Profile = () => {
  const location = useLocation();
  const userName=location.state?.userName;
  const userId=location.state?.userId;
  const BASE_API_URL="http://localhost:8082/api/jobbox";
  const [userData,setUserData]=useState();
  const navigate = useNavigate();

  const getUser = async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCandidate?userId=${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    getUser(userId);
  },[userId]);


  const toggleSettings = () => {
    navigate('/');
  };

 
  const user = {
    userName: userName,
    
    userId: userId,
   };

    return (
      <div className='candidate-dashboard-container'>
      <div className='left-side'>
     <CandidateLeftSide user={user} />
   </div>

      <div className='rightside'>
      
     
      <div className="d-flex justify-content-end">
      <div className="candidate-search">
        <div className="user col px-3">
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer ">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon align-item-end' style={{ color: 'black' }} />
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
      {/* <button className="profile-button" onClick={handleEdit}>Edit</button> */}
    </>
  )}
</div>


     
    </div>
      </div>

  )
}

export default Profile
