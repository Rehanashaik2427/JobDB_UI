import { Formik, Field } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';
import axios from 'axios';

const CandiRegister = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [otp, setOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [updateUserMessage, setUpdateUserMessage] = useState(false);
    const navigate = useNavigate();

    // Validation schema for Formik
    const validationSchema = yup.object().shape({
        userName: yup.string().required("Name is required"),
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        userEmail: yup.string().email("Invalid email").required("Email is required"),   
        password: yup
            .string()
            .min(8, "Password must be 8 characters long")
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .required("Repeat Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
        agreeToEmailValidation: yup.bool().oneOf([true], "You must agree to validate your email"),
    });

    // Function to validate password criteria
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

    // Initial form values
    const initialValues = {
        userName: "",
        userEmail: "",
        phone: "",
        appliedDate: "",
        password: "",
        userRole: 'Candidate',
        confirmPassword: "", // Corrected the field name here
        agreeToEmailValidation: false,
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        if (!validatePassword(values)) {
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8082/api/jobbox/saveUser', values);

            if (!response.data || response.data === "undefined" || response.data === "") {
         
                setEmailExistsError(true);
                setSubmitting(false);
                return;
            }


            setRegistrationSuccess(true);
            navigate('/signup/candiSignup/registration-success-msg');
        } catch (error) {
            console.error('Error registering candidate:', error);
        }
    };



    // Handle OTP generation
   

    const updateUserData = async (values) => {
        try {
            const response = await axios.put('http://localhost:8082/api/jobbox/updateUserData', values);

            if (response.data) {
                navigate('/signup/candiSignup/registration-success-msg');
            } else {
                setErrorMessage(true);
                return;
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            alert("Data not updated");
        }
    };

    const sendOTP = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/jobbox/validateUserEmail?userEmail=${email}`);
            setOtpValue(response.data);
            setShowOTPModal(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const handleOTPVerification = () => {
        if (otpValue == enterOtpValue) {
            setOtpVerified(true);
            setShowOTPModal(false);
        } else {
            setOtpVerified(false);
            setErrorMessage('Invalid OTP. Please try again.');
            console.error('Error generating OTP:');
            setErrorMessage('Email already exists please login into your account');
        }
    };

   

    return (
        <div className="auth-layout-wrap">
            <div className="auth-content">
                <Card className="o-hidden">
                    <Row>
                        {/* Left Section */}
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
                        {/* Right Section */}
                        <Col md={6}>
                            <div className="p-4">
                                <h1 className="mb-3 text-18">Registration Form</h1>
                                <p>(<span style={{ color: 'red' }}>*</span> indicates mandatory fields)</p>

                                {/* Formik form */}
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <form onSubmit={handleSubmit}>
                                            {/* Text fields */}
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
                                                        Your Email <span style={{ color: 'red' }}>*</span>
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
                                                name="confirmPassword" // Corrected field name here
                                                label={
                                                    <>
                                                        Confirm Password <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                required
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                helperText={errors.confirmPassword}
                                                error={errors.confirmPassword && touched.confirmPassword}
                                                fullWidth
                                            />

                                            <div className="form-check">
                                                <Field
                                                    type="checkbox"
                                                    name="agreeToEmailValidation"
                                                    id="agreeToEmailValidation"
                                                    className="form-check-input"
                                                    checked={values.agreeToEmailValidation}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        sendOTP(values.userEmail);
                                                    }}
                                                />
                                                <label htmlFor="agreeToEmailValidation" className="form-check-label">
                                                    I agree to validate my email
                                                </label>
                                                {errors.agreeToEmailValidation && (
                                                    <p className="error-message">{errors.agreeToEmailValidation}</p>
                                                )}
                                            </div>

                                       
                                            {/* Error messages */}
                                            {passwordMatchError && (
                                                <p className="error-message">Password and confirm password do not match</p>
                                            )}
                                            {passwordCriteriaError && (
                                                <p className="error-message">Password should include at least one number, one special character, one capital letter, one small letter, and have a length between 8 to 12 characters</p>
                                            )}
                                            {emailExistsError && (
                                                <div>
                                                    <p className="error-message">
                                                        Email already exists. Please <Link to='/signup/candiSignup/registration-success-msg/user-signin'>click here for login</Link>
                                                    </p>
                                                    <p>OR</p>
                                                    <Button onClick={() => updateUserData(values)}>Update Your Data</Button>
                                                </div>
                                            )}

                                            {errorMessage && <div className="text-danger">{errorMessage}</div>}

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                                disabled={!otpVerified || isSubmitting || emailExistsError}
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

            <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextField
                        type="text"
                        label="Enter OTP received in email"
                        value={enterOtpValue}
                        onChange={(e) => setEnterOtpValue(e.target.value)}
                    />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOTPModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleOTPVerification}>
                        Verify OTP
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CandiRegister;
