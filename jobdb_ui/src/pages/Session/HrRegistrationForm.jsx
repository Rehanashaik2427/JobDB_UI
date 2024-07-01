import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';
import axios from 'axios';

const HrRegistrationForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { companyName } = location.state || {};

    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        userName: yup.string().required("Name is required"),
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string()
            .required("Password is required")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/, "Password should include at least one number, one special character, one uppercase letter, one lowercase letter, and be between 8 to 12 characters"),
        confirmPassword: yup.string()
            .required("Repeat Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
        agreeToEmailValidation: yup.bool().oneOf([true], "You must agree to validate your email"),
    });

    // Initial form values
    const initialValues = {
        userName: "",
        userEmail: "",
        phone: "",
        appliedDate: "",
        password: "",
        confirmPassword: "",
        companyName: companyName,
        userRole: 'HR',
        agreeToEmailValidation: false,
    };

    // Function to validate password criteria
    const validatePassword = (values) => {
        const { password, confirmPassword } = values;
        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/.test(password);
        const passwordsMatch = password === confirmPassword;

        if (!isValidPassword) {
            setPasswordCriteriaError(true);
            return false;
        }

        if (!passwordsMatch) {
            setErrorMessage("Passwords do not match");
            return false;
        }

        return true;
    };

    // Function to handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        
        if (!validatePassword(values)) {
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8082/api/jobbox/saveUser', values);

            if (response.data === "User already exists") {
                setEmailExistsError(true);
            } else {
                setRegistrationSuccess(true);
                navigate('/signup/hrSignup/registration-success-msg');
            }

        } catch (error) {
            console.error('Error registering HR:', error);
            setErrorMessage("Error registering HR. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    // Function to send OTP
    const sendOTP = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/jobbox/validateUserEmail?userEmail=${email}`);
            setOtpValue(response.data);
            setShowOTPModal(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrorMessage("Error sending OTP. Please try again later.");
        }
    };

    // Function to handle OTP verification
    const handleOTPVerification = () => {
        if (otpValue === enterOtpValue) {
            setOtpVerified(true);
            setShowOTPModal(false);
            // Proceed to submit form data after OTP verification
        } else {
            setOtpVerified(false);
            setErrorMessage('Invalid OTP. Please try again.');
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
                                        isLogin={false} // Set isLogin to false for registration
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
                                    {({ errors, touched, isSubmitting, handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>
                                            {/* Text fields */}
                                            <TextField
                                                type="text"
                                                name="userName"
                                                label="Your name *"
                                                required
                                            />
                                            <TextField
                                                type="email"
                                                name="userEmail"
                                                label="Your Email *"
                                                required
                                            />
                                            <TextField
                                                type="tel"
                                                name="phone"
                                                label="Phone Number"
                                            />
                                            <TextField
                                                type="password"
                                                name="password"
                                                label="Password *"
                                                required
                                            />
                                            <TextField
                                                type="password"
                                                name="confirmPassword"
                                                label="Confirm Password *"
                                                required
                                            />

                                            {/* Agreement checkbox */}
                                            <div className="form-check">
                                                <Field
                                                    type="checkbox"
                                                    name="agreeToEmailValidation"
                                                    id="agreeToEmailValidation"
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="agreeToEmailValidation" className="form-check-label">
                                                    I agree to validate my email
                                                </label>
                                                {errors.agreeToEmailValidation && touched.agreeToEmailValidation && (
                                                    <p className="error-message">{errors.agreeToEmailValidation}</p>
                                                )}
                                            </div>

                                            {/* Error messages */}
                                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                                            {emailExistsError && (
                                                <div>
                                                    <p className="error-message">
                                                        Email already exists. Please <Link to='/signup/candiSignup/registration-success-msg/user-signin'>click here for login</Link>
                                                    </p>
                                                    <Button onClick={() => updateUserData(values)}>Update Your Data</Button>
                                                </div>
                                            )}

                                            {/* Submit button */}
                                            <Button
                                                type="submit"
                                                className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                                disabled={!otpVerified || isSubmitting || emailExistsError}
                                            >
                                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>

                                {/* Modal for OTP verification */}
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
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default HrRegistrationForm;
