import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';

const CandiRegister = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [updateUserMessage, setUpdateUserMessage] = useState(false);
    const navigate = useNavigate();

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
        const isValidPassword = passwordRegex.test(password) && password === confirmPassword;

        if (!isValidPassword) {
            setPasswordCriteriaError(true);
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
        userRole: 'Candidate',
        confirmPassword: ""
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
                setEmailExistsError(true);
            }else{
                setRegistrationSuccess(true);

            navigate('/signup/candiSignup/registration-success-msg'); // Ensure this matches the route
            }
            

        } catch (error) {
            if (error.message.includes("User already exists")) {
           
                navigate('/signup/candiSignup/registration-success-msg/user-signin',{ state: initialValues.userRole })
            } else {
                console.error('Error registering candidate:', error);
            }
        }
    };
const updateUserData=async(values)=>{
     try{
        const response = await fetch('http://localhost:8082/api/jobbox/updateUserData', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
    });
    if(!response.ok)
        setErrorMessage(true)
    else
    navigate('/signup/candiSignup/registration-success-msg');

} catch{
        alert("data not update")
    }
    
}
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
                                        routeUrl="/signup/candiSignup/registration-success-msg/user-signin"
                                        googleHandler={() => alert("google")}
                                        facebookHandler={() => alert("facebook")}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="p-4">
                                <h1 className="mb-3 text-18">Registration Form</h1>
                                <p>(<span style={{color:'red'}}>*</span> indicates mandatory fields)</p>
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
                                                label={
                                                    <>
                                                      Your name <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                  }
                                                  required
                                                onBlur={handleBlur}
                                                value={values.userName}
                                                onChange={handleChange}
                                                helperText={errors.userName}
                                                error={errors.userName && touched.userName}
                                            />
                                            <TextField
                                                type="email"
                                                name="userEmail"
                                                label={
                                                    <>
                                                      Email <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                  }
                                                  required   
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
                                                label={
                                                    <>
                                                      Password <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                  }
                                                  required
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
                                                label={
                                                    <>
                                                        Confirm password <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                  }
                                                  required    
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                helperText={errors.confirmPassword}
                                                error={errors.confirmPassword && touched.confirmPassword}
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
                                                <>
                                                <p className="error-message">Email already exists. Please <Link to='/signup/candiSignup/registration-success-msg/user-signin'>click here for login</Link></p>
                                                <p>OR</p>
                                                <p > Update Your Data <Button onClick={() => updateUserData(values)}> Update </Button> </p>
                                                </>
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
    );
};

export default CandiRegister;
