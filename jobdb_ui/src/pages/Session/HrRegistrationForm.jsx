import { Formik } from 'formik';
import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';

const HrRegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { companyName } = location.state || {};
  console.log(companyName);

  console.log(companyName," ")
  const validationSchema = yup.object().shape({
      userName: yup.string().required("Name is required"),
      userEmail: yup.string().email("Invalid email").required("Email is required"),
    
      password: yup
          .string()
          .min(8, "Password must be 8 characters long")
          .required("Password is required"),
      confirmPassword: yup
          .string()
          .required("Repeat Password is required")
          .oneOf([yup.ref("password")], "Passwords must match")
  });

  const validatePassword = (values) => {
      const { password, confirmPassword } = values; 
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
      const isValidPassword = passwordRegex.test(password) ;
      const isMatchPassword=password === confirmPassword;
      if (!isValidPassword) {
          setPasswordCriteriaError(true);
          return false;
      }else if(!isMatchPassword){
        setPasswordMatchError(true);
        return false;
      }

      return true;
  };

  const initialValues = {
      userName: "",
      userEmail: "",
      phone: "",
      appliedDate: "",
      password: "",
      userRole: 'HR',
      confirmPassword: "",
      companyName:companyName
  };

  const handleSubmit = async (values, { setSubmitting }) => {
      if (!validatePassword(values)) {
          setSubmitting(false);
          return;
      }

      try {
          const response = await fetch('http://localhost:8082/api/jobbox/saveUser', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
          });

          if (!response.ok) {
            throw new Error('Failed to register candidate');
          }
          setRegistrationSuccess(true);
    
         
          navigate('/signup/hrSignup/registration-success-msg'); 
    
        }  catch (error) {
          if (error.message.includes("User already exists")) {
            setEmailExistsError(true);
          } else {
            console.error('Error registering candidate:', error);
          }
        }
  };
  return (
    <div className="auth-layout-wrap">
    <div className="auth-content">
        <Card className="o-hidden">
            <Row>
                <Col md={6} className="text-center auth-cover">
                    <div className="ps-3 auth-right">
                        <div className="auth-logo text-center mt-4">
                            <img src="https://jobbox.com.tr/wp-content/uploads/2022/12/jobbox-1-e1672119718429.png" alt="JobDB" />
                        </div>

                        <div className="w-100 h-100 justify-content-center d-flex flex-column">
                            <SocialButtons
                                isLogin
                                routeUrl="/signin"
                                googleHandler={() => alert("google")}
                                facebookHandler={() => alert("facebook")}
                            />
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="p-4">
                        <h1 className="mb-3 text-18">HR Registraion</h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>

                                    <TextField
                                        type="text"
                                        name="userName"
                                        label="Your name"
                                        onBlur={handleBlur}
                                        value={values.userName}
                                        onChange={handleChange}
                                        helperText={errors.userName}
                                        error={errors.userName && touched.userName}
                                    />
                                    <TextField
                                        type="email"
                                        name="userEmail"
                                        label="Email address"
                                        onBlur={handleBlur}
                                        value={values.userEmail}
                                        onChange={handleChange}
                                        helperText={errors.userEmail}
                                        error={errors.userEmail && touched.userEmail}
                                    />

                                    <TextField
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        label="Phone Number"
                                        value={values.phone}
                                        onChange={handleChange}
                                        helperText={errors.phone}
                                        error={errors.phone && touched.phone}
                                      
                                        fullWidth
                                    />
                                
                                    <TextField
                                        type="password"
                                        name="password"
                                        label="Password"
                                        onBlur={handleBlur}
                                        value={values.password}
                                        onChange={handleChange}
                                        helperText={errors.password}
                                        error={errors.password && touched.password}
                                    />

                                    <TextField
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        helperText={errors.confirmPassword}
                                        error={errors.confirmPassword && touched.confirmPassword}
                                        required
                                        fullWidth
                                    />

                                    {/* Display error messages */}
                                    {passwordMatchError && (
                                        <p className="error-message">Password and confirm password do not match</p>
                                    )}

                                    {passwordCriteriaError && (
                                        <p className="error-message">Password should include at least one number, one special character, one capital letter, one small letter, and have a length between 8 to 12 characters</p>
                                    )}

                                    {emailExistsError && (
                                        <p className="error-message">Email already exists. Please <Link to='/candidates'>click here for login</Link></p>
                                    )}

                                    {errorMessage && <div className="text-danger">{errorMessage}</div>}

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</div>
  )
}

export default HrRegistrationForm
