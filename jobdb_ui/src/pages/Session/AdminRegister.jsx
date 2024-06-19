import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './Admin.css'; // Import custom CSS file

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    history.push("/admin-dashboard");
  }

  return (
    <div className="centered-form">
      <div className='form-container'>
      <h2 style={{ textAlign: 'center' }}>Admin Form</h2>
      <form  onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="Email">Email:</label>
          <input  id="Email" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className='form-group'> 
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div className='admin-button'>
          <button type="submit">Login</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AdminRegister;
