import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Signin = () => {
  const [userType, setUserType] = useState("");
  const history = useHistory(); // Initialize useHistory

  // Function to handle user type selection
  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Programmatic navigation based on user type
    if (type === "admin") {
      history.push("/admin-register");
    }
    if (type === "hr") {
      history.push("/hr-signin");
    }
    if (type === "candidate") {
      history.push("/candidates");
    }
  };

  return (
    <div className="centered-form">
    <div className="form-container">
      <h2 className='heading'>User Signin</h2>
      <form onSubmit={(event) => event.preventDefault()} className="user-registration-form">
        <p style={{textAlign:'center'}}>Select your role and login</p>
        <div className="radio-group">
            <div className="radio-button">
              <input type="radio" name="userType" value="admin" onChange={() => handleUserTypeChange("admin")} checked={userType === "admin"} /> Admin
              {/* <label>Admin</label> <br /> */}
            </div >

            <div className="radio-button">
            <input type="radio" name="userType" value="hr" onChange={() => handleUserTypeChange("hr")} checked={userType === "hr"} />Hr
            {/* <label>HR</label> <br /> */}
            </div>

            <div className="radio-button">
              <input type="radio" name="userType" value="candidate" onChange={() => handleUserTypeChange("candidate")} checked={userType === "candidate"} />Candidate
              {/* <label>Candidate</label> */}
            </div>
          </div>
      </form>
    </div>
  </div>
  );
};

export default Signin;
