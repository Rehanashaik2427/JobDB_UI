import axios from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';

const Candidates = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    userEmail: '',
    password: '',
  });

  const history = useHistory();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const BASE_API_URL = "http://localhost:8082/api/jobbox";

  const handleSubmit = async (e) => {
    e.preventDefault();

   try{

      const response = await axios.get(`${BASE_API_URL}/login?userEmail=${formData.userEmail}&password=${formData.password}`);
      const user = response.data;


      if (user) {
        if (user.userRole === 'Candidate') {
          history.push('/candidate-dashboard', { userId: user.userId });
        } else {
          setErrorMessage("You do not have permission to login as Candidate . Please enter the correct email ID.");
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
        <h2>Candidate Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email:</label>
            <input type="email" id="login-email" name="userEmail" value={formData.userEmail} placeholder='email' onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input type="password" id="login-password" name="password" value={formData.password} placeholder='password' onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

        </form>
        <div className="candidate-login-switch-form">
          <Link to={{pathname:"/forget-password", state:{userRole:"candidate"}}}>Forget Password?</Link>
          Don't have an account? <Link to="/candidate-signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Candidates;

