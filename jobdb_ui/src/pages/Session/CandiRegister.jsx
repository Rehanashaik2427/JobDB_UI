import axios from 'axios';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
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
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);


    const [disableFormFields, setDisableFormFields] = useState(false); // State to manage form field disablement

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
    const appliedOn = new Date(); // Get current date and time
    const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
    const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
    
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); // Output: 2024-07-09 (example for today's date)
    
    // Initial form values
    const initialValues = {
        userName: "",
        userEmail: "",
        phone: "",
        appliedDate:formattedDate,
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
         
        }
    };

    const handleAgree = () => {
        setAgreed(true);
        // Perform action when user agrees to terms
        alert('You agreed to Terms and Conditions!');
        handleClose(); // Close the modal after agreeing
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
                                    <img src="/jb_logo.png" alt="JobDB" />
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
                                <h1 className="mb-3 text-18">Candidate Registration Form</h1>
                                <p>(<span style={{ color: 'red' }}>*</span> indicates mandatory fields)</p>

                                {/* Formik form */}
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <Form onSubmit={handleSubmit}>
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
                                                disabled={disableFormFields}
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
                                                disabled={disableFormFields}
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
                                                disabled={disableFormFields}
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
                                                disabled={disableFormFields}
                                            />

                                            <TextField
                                                type="password"
                                                name="confirmPassword"
                                                label={
                                                    <>
                                                        Confirm Password <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                required
                                                value={values.confirmPassword}
                                                onChange={
                                                    handleChange
                                                }
                                                helperText={errors.confirmPassword}
                                                error={errors.confirmPassword && touched.confirmPassword}
                                                fullWidth
                                                disabled={disableFormFields}
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
                                                        setDisableFormFields(e.target.checked); // Set disable state based on checkbox
                                                        if(e.target.checked){
                                                        sendOTP(values.userEmail); }// Trigger OTP sending}
                                                        
                                                    }}
                                                    style={{ marginRight: '10px', transform: 'scale(1.4)', borderColor:'black' }}
                                                    />
                                                    <label htmlFor="agreeToEmailValidation" className="form-check-label" style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '5px', verticalAlign: 'middle' }}>
                                                        I agree to validate my email
                                                    </label>
                                                {errors.agreeToEmailValidation && (
                                                    <p className="error-message">{errors.agreeToEmailValidation}</p>
                                                )}
                                            </div>
                                            <Button
                                                    onClick={handleShow}
                                                    disabled={agreed}
                                                    className="mt-3"
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        borderColor: '#007bff',
                                                        color: '#ffffff',
                                                        // padding: '5px 10px',
                                                        fontSize: '10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',

                                                    }}
                                                >
                                                    Agree to Terms and Conditions
                                                </Button>
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

                                            {/* Submit button */}
                                            <Button
                                                type="submit"
                                                className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                                disabled={!otpVerified || isSubmitting || emailExistsError || !agreed}
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
                                <Modal show={showModal} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Terms and Conditions</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>This is where your terms and conditions content will be displayed.</p>
                                        <p>Make sure to include all necessary information.</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleAgree}>
                                            Agree
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

export default CandiRegister;
