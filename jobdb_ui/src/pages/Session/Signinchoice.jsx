import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Signinchoice = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
    const handleUserTypeChange = (type) => {
      setUserType(type);
   
      if (type === "hr") {
        navigate("/signup/hrSignup/registration-success-msg/user-signin");
      }
      if (type === "candidate") {
        navigate("/signup/candiSignup/registration-success-msg/user-signin"); // Navigate to the nested route
      }
      
    };
  
    return (
      <Container className="centered-form">
        <div className="form-container">
          <h1 className='heading'>User Signin</h1>
          <Form onSubmit={(event) => event.preventDefault()} className="user-registration-form">
            <p style={{ textAlign: 'center' }}>Select your role and please fill the details</p>
            <div className="radio-group">
             
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
  
export default Signinchoice;
