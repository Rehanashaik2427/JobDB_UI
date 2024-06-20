import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const Resume = () => {
  const BASE_API_URL="http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName=location.state?.userName;
  const userId=location.state?.userId;
  const [showMessage, setShowMessage] = useState(false);


  const [resumes, setResumes] = useState([]);

    useEffect(() => {
        // Fetch resumes data from the backend
        axios.get(`${BASE_API_URL}/getResume?userId=${userId}`)
            .then(response => {
                setResumes(response.data);
            })
            .catch(error => {
                console.error('Error fetching resumes:', error);
            });
    }, []);

   // Function to handle resume download
   const handleDownload = async (resumeId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/jobbox/downloadResume?resumeId=${resumeId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const [showBriefSettings, setShowBriefSettings] = useState(false);
  const handleBrief=async(resumeId,fileType)=>{

    const response = await axios.get(`http://localhost:8082/api/jobbox/getBriefResume?resumeId=${resumeId}`);
    if(response){
      setShowMessage(response.data);
      setShowBriefSettings(!showBriefSettings);
  
    }
    
  }

 
  
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
const handleDelete=async(resumeId)=>{
  try{
   const response= await axios.delete(`${BASE_API_URL}/deleteResume?resumeId=${resumeId}`)
   if(response.data)
    {
      alert("Resume Delete")
       window.location.reload(); // Refresh the page
    }
  }catch{
alert("Failed To delete")
  }

}
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
      <div className="top-right-content">
          <div className="candidate-search">
            <input type='text' placeholder='serach'></input>
            <button>
              <FontAwesomeIcon icon={faSearch} className='button' style={{color:'skyblue'}}/>
            </button>
            <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{color:'black'}} onClick={toggleSettings}/></div>
          
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

{showBriefSettings && (
         <div className="modal-summary">
         <div className="modal-content-summary">
         <span className="close" onClick={() => setShowBriefSettings(false)}>&times;</span>
          {showMessage}
        </div>
        </div>
      )}

        <div>
          <h1 style={{textAlign:'center'}}>MY RESUMES</h1>
          
            
            <div className='resume-div'>
                {resumes.map((resume, index) => (
                        <span className='resume-box' key={index}>
                        {/* {resume.fileName} */} <h1>Resume :{index+1}</h1>
                        <h3>{resume.message}</h3>

                        {resume.fileType === 'file' && (
                                <button className='download' onClick={() => handleDownload(resume.id, resume.fileName)}>Download</button>
                            )}
                            {resume.fileType === 'link' && (
                                <a href={resume.fileName} target="_blank" rel="noopener noreferrer">Open Link</a>
                            )}
                            {resume.fileType === 'brief' && (
                                <button className='open-brief-modal' onClick={() => handleBrief(resume.id, resume.fileType)}>Open Brief</button>
                            )}
                        <button className='download' onClick={() => handleDelete(resume.id,resume.fileName)}>Delete</button>



                    </span>
                ))}
            </div>
        
          <div className='adding-resumes'>
          <Link to={{
          pathname: '/resumeAdd',
          state: { userName: userName,userId:userId }
        }}>ADD NEW RESUME</Link>
           
       
        </div>
      </div>
    </div>
    </div>
  );
};

export default Resume;
