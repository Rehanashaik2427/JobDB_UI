import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './Home.css';
const ForgetPassword = () => {
  const [userEmail, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState('email');
  const [otpEnter, setOtpEnter] = useState();
  const BASE_API_URL = "http://localhost:8082/api/jobbox";



  const [passwordMatchError, setPasswordMatchError] = useState(false);
 
  const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);

  const handleEmailSubmit = async (e) => {
    
    e.preventDefault();
    try{
      const response =await axios.get(`${BASE_API_URL}/generateOTP?userEmail=${userEmail}`);
      if(response.data){
        setOtp(response.data);
        setStage('otp');
      }
       
      else
      setErrorMessage("InvalidEmail")
    }catch(error){
console.log(error);
    }
   
  };
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log(otp);
    console.log(otpEnter)
    if(otp==otpEnter)
    setStage('resetPassword');
  else
  setErrorMessage("Invalid otp");
  };


  const handlePasswordReset = async(e) => {
    e.preventDefault();
   
    if (!validatePassword()) {
      return;
    }
    try{
      const response =await axios.put(`${BASE_API_URL}/updatePassword?userEmail=${userEmail}&newPassword=${newPassword}`);
      if(response.data){
        setSuccessMessage("Password reset successfully! Now You can login with your new password.");
      }
      else{
        setErrorMessage('');
        setPasswordMatchError(false);
        setPasswordCriteriaError(false);
      }
    }
    catch(error){
      console.log(error);
    }
    // Handle the password reset logic here (e.g., send a request to the backend)
  
    
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
    const isValidPassword = passwordRegex.test(newPassword) && newPassword === confirmPassword;

    if (!isValidPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMatchError(true);
      } else {
        setPasswordCriteriaError(true);
      }
      return false;
    }
    return true;
  };



  return (
    <div className='forgetpassword-container'>
       {passwordMatchError && (
          <p className="error-message">Password and confirm password do not match</p>
        )}
     
        {passwordCriteriaError && (
          <p className="error-message">Password should include at least one number, one special character, one capital letter, one small letter, and have a length between 8 to 12 characters</p>
        )}
    {stage === 'email' && (
      <form onSubmit={handleEmailSubmit}>
        <label htmlFor="email">Enter your email:</label>
        <input type="email" id="email" value={userEmail} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <button type="submit">Submit</button>
      </form>
    )}

    {stage === 'otp' && (
      <form onSubmit={handleOtpSubmit}>
        <label htmlFor="otp">Enter OTP:</label>
        <input type="number" id="otp" value={otpEnter} onChange={(e) => setOtpEnter(e.target.value)} required />
        <br /><br />
        <button type="submit">Submit</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    )}

    {stage === 'resetPassword' && (
      <form onSubmit={handlePasswordReset}>
         <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <br /><br />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <br /><br />
          <button type="submit">Reset Password</button>
          <br /><br />
          {successMessage && <div className="success-message">{successMessage}
          <Link to='/signin'>login</Link>
          </div>}
      </form>
    )}
  </div>
);
};

export default ForgetPassword;
