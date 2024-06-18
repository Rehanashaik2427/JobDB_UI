import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';
const HrDashboard = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
 
  // const userName=location.state?.userName;
  const userEmail=location.state?.userEmail;

  console.log(userEmail);


 
  const [userData, setUserData] = useState();
  const [userName,setUserName]=useState();
  
 

  const fetchUserData = async (userEmail) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/getHRName`, {
          
            params: {
              userEmail: userEmail
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
   
      fetchUserData(userEmail);
    
  }, [userEmail]);

 // const userName=userData.userName;

  console.log(userName);

  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const [countOfJobs,setCountOfJobs]=useState(0);
  const fetchCountOfJobs = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/CountOfJobsPostedByEachCompany?userEmail=${userEmail}`);
      setCountOfJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [countOfApplications,setCountOfApplications]=useState();
  const fetchCountOfApplication= async()=>{
    try{
      const response=await axios.get(`${BASE_API_URL}/CountOfApplicationByEachCompany?userEmail=${userEmail}`)
      setCountOfApplications(response.data);
    }catch(error){
console.log (error)
    }
  }

  const[countOfShortlistedCandiCompany , setCountOfShortlistedCandiCompany] = useState();
  // const fetchCountOfShortlistedCandiCompany = async ()=>{
  //   try{
  //     const response = await axios.get(`${BASE_API_URL}/CountOfShortlistedCandidatesByEachCompany?userEmail=${userEmail}`);
  //     setCountOfShortlistedCandiCompany(response.data);
  //   }
  //   catch(error){
  //     console.log (error)
  //   }
  // }
  useEffect(()=>{
    fetchCountOfJobs();
    fetchCountOfApplication();
    // fetchCountOfShortlistedCandiCompany();
  },[])

  const user = {
   userName: userName,
    userEmail: userEmail,
  };


  return (
    <div className='hr-dashboard-container'>
         <div className='hr-leftside'>
        <HrLeftSide user={user} />
      </div>

      <div className='hr-rightside'>
        {/* <h2>{userName}</h2> */}
       
      <div className="candidate-search">
            {/* <input type='text' placeholder='serach'></input>
            <button>
              <FontAwesomeIcon icon={faSearch} className='button' style={{color:'skyblue'}}/>
            </button> */}
            <div><FontAwesomeIcon icon={faUser} id="user" className='icon'  style={{color:'black'}} onClick={toggleSettings}/></div>
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

            <div className="box-container">

                {/* First row - first box */}
                <div className="box">
                
                    <h2>Jobs</h2>

                    <h4 style={{ alignContent: 'center' }}></h4>
                    <img src="https://cdn-icons-png.flaticon.com/128/3688/3688609.png" className="animated-icons" alt="Jobs Icon" />
                    <Link to={{ pathname: '/posted-jobs',state: { userName: userName, userEmail:userEmail } }}>
                    <p> {countOfJobs} posted by us</p>

                   </Link>
                </div>

                {/* First row - second box */}
                <div className="box">
                    <h2>Total Applications</h2>
                    <img src="https://cdn-icons-png.flaticon.com/128/942/942748.png" className="animated-icons" alt="Applications Icon" />
                    
                    <p >Total Applicants  {countOfApplications}</p>
                </div>

                {/* Second row - first box */}
                <div className="box">
                    <h2>Shortlisted candidates</h2>
                    <img src="https://cdn-icons-png.flaticon.com/128/11356/11356039.png" className="animated-icons" alt="Candidates Icon" />
                    <p>Shortlisted Candidates  {countOfShortlistedCandiCompany}</p>
                </div>

                  {/* Second row - second box */}
                <div className="box">
                <Link to={{ pathname: '/dreamApplication',state: { userName: userName, userEmail:userEmail } }}>
                    <h2>Dream Applications</h2>
                    <img src="https://cdn-icons-png.flaticon.com/128/15597/15597760.png" className="animated-icons" alt="Activities Icon" />
                </Link>
                     

                </div>
            </div>

        </div>

      </div>
    
  );
}

export default HrDashboard;
