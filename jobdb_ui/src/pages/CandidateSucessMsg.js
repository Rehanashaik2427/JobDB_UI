import React from 'react';
import { Link } from 'react-router-dom';


const CandidateSucessMsg = () => {
  return (
    <div className="sucess-msg-container">
      <h2>Login Successful</h2>
      <p>Welcome back!</p>
    <Link to='/candiadte-dashboard'>click here to see your details</Link>
    </div>
  );
};

export default CandidateSucessMsg;
