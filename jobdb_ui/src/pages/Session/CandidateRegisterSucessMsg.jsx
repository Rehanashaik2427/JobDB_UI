import React from 'react';
import { Link } from 'react-router-dom';
import './CandidateDashboard.css';


const CandidateRegisterSucessMsg = () => {
  return (
    <div className="sucess-msg-container" style={{textAlign:'center'}}>
    <h2>Registration Successful</h2>
    <p>Welcome!</p>
    <Link to='/candidates'>click here for login</Link>
  </div>
  )
}

export default CandidateRegisterSucessMsg;




