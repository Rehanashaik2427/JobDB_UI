import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css';



const HrRegistrationSuccessMsg=()=>{
  
    return (
      <div className="sucess-msg-container" style={{textAlign:'center'}}>
      <h2>Registration Successful</h2>
      <p>please check Your Mail id</p>
      <p>You can login after approved</p>
      <Link to='/hr-signin'>click here to Login</Link>
    </div>
    )
  } 
  export default HrRegistrationSuccessMsg;