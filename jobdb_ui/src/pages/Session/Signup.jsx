import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './StyleSession/signup.css';

const Signup = () => {
  const [userType, setUserType] = useState("");
const navigate = useNavigate();
  const handleUserTypeChange = (type) => {
    setUserType(type);
    if (type === "admin") {
      navigate("/admin");
    }
    if (type === "hr") {
      navigate("/findCompany");
    }
    if (type === "candidate") {
      navigate("/signup/candiSignup"); // Navigate to the nested route
    }
    
  };

  return (
    <Container className="centered-form">
      <div className="form-container">
        <h1 className='heading'>User Registration</h1>
        <Form onSubmit={(event) => event.preventDefault()} className="user-registration-form">
          <p style={{ textAlign: 'center' }}>Select your role and please fill the details</p>
          <div className="radio-group">
            <Form.Check
              type="radio"
              label="Admin"
              name="userType"
              value="admin"
              onChange={() => handleUserTypeChange("admin")}
              checked={userType === "admin"}
            />
            <Form.Check
              type="radio"
              label="HR"
              name="userType"
              value="hr"
              onChange={() => handleUserTypeChange("hr")}
              checked={userType === "hr"}
            />
            <Form.Check
              type="radio"
              label="Candidate"
              name="userType"
              value="candidate"
              onChange={() => handleUserTypeChange("candidate")}
              checked={userType === "candidate"}
            />
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
