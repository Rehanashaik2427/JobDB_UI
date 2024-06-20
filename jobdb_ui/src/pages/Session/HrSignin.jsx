import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const HrSignin = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    userEmail: '',
    password: '',
  });

  const navigate= useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const BASE_API_URL = "http://localhost:8082/api/jobbox";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

     
     

      const response = await axios.get(`${BASE_API_URL}/login?userEmail=${formData.userEmail}&password=${formData.password}`);
      const user = response.data;


      if (user) {
        if (user.userRole === 'HR' && user.userStatus ==='Approved') {
          navigate('/hr-dashboard', { userEmail: formData.userEmail });
        } else {
          setErrorMessage("You do not have permission to login as HR. Please enter the correct email ID.");
        }
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred during login. Please try again.");

    }
  };

  return (
    <div className="centered-form">
      <div className="form-container">
        <h2>HR Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userEmail">Email:</label>
            <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder='email' required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder='password' required />
          </div>
          <div className="form-group">
            <button type="submit">Login</button>
            <Link to={{pathname:"/forget-password", state:{userRole:"HR"}}}>Forget Password?</Link>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

        </form>
      </div>
    </div>
  );
};

export default HrSignin;

