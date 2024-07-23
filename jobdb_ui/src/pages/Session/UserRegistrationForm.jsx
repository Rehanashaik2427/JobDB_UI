import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';
import Swal from 'sweetalert2';
const UserRegistrationForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [disableFormFields, setDisableFormFields] = useState(false); // State to manage form field disablement
    const navigate = useNavigate();
    const [userType, setUserType] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Handler function to update userType state
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        console.log('userType:', e.target.value);
    };
    console.log(userType);


    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        userName: yup.string().required("Name is required"),
        userEmail: yup.string().email("Invalid email").required("Email is required"),
        companyName: yup.string().when('userType', {
            is: 'HR',
            then: yup.string().required("Company Name is required"),
        }),
        phone: yup.string().when('userType', {
            is: 'Candidate',
            then: yup.string()
        }),
        password: yup.string()
            .required("Password is required")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/, "Password should include at least one number, one special character, one uppercase letter, one lowercase letter, and be between 8 to 12 characters"),
        confirmPassword: yup.string()
            .required("Repeat Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
        agreeToEmailValidation: yup.bool().oneOf([true], "You must agree to validate your email"),
    });


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
        appliedDate: formattedDate,
        password: "",
        confirmPassword: "",
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
        values.userRole = userType;
        if (userType === "HR") {
            values.phone = null;
        }
        if (userType === "Candidate") {
            values.companyName = null; // Corrected capitalization of companyName
        }

        try {
            const response = await axios.post('http://localhost:8082/api/jobbox/saveUser', values);

            if (!response.data || response.data === "undefined" || response.data === "") {
                setEmailExistsError(true);
                setSubmitting(false);
                return;
            } else {
                // Show SweetAlert for registration success
                let additionalText = "";
                if (userType === "HR") {
                    additionalText = "Please check Your Mail id  " + '\n' + "You can login after approved " + '\n' + " Click to visit Home";
                }
                if (userType === "Candidate") {
                    additionalText = "Welcome!" + '\n' + "Click here for login";
                }
                // Show SweetAlert for registration success
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Your registration has been successful.' + (additionalText ? '\n' + additionalText : ''),
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (userType === "HR") {
                            navigate('/');
                        } else if (userType === "Candidate") {
                            navigate('/signin');
                        }
                    }
                });
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
        if (otpValue == enterOtpValue) {
            setOtpVerified(true);
            setShowOTPModal(false);
            // Proceed to submit form data after OTP verification
        } else {
            setOtpVerified(false);
            setErrorMessage('Invalid OTP. Please try again.');
        }
    };

    // Function to update user data (in case of email already exists)
    const updateUserData = async (values) => {
        try {
            const response = await axios.put('http://localhost:8082/api/jobbox/updateUserData', values);

            if (response.data) {

                Swal.fire({
                    icon: 'success',
                    title: 'Update Successful!',
                    text: 'Your data has been updated successful.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {

                        navigate('/signin');

                    }
                });
            } else {
                setErrorMessage(true);
                return;
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            alert("Data not updated");
        }
    };
    const handleAgree = () => {
        setAgreed(true);
        // Perform action when user agrees to terms
        alert('You agreed to Terms and Conditions!');
        handleClose(); // Close the modal after agreeing
    };
    return (
        <div>

            <div className="auth-layout-wrap" style={{ overflow: 'hidden' }}>

                <h1 className="heading">User Registration</h1>
                {/* <p style={{ textAlign: 'center' }}>Select your role and please fill the details</p> */}

                {userType === '' && (
                    <p style={{ color: 'red', textAlign: 'center' }}>
                        Please select a user type below to proceed with the form.
                    </p>
                )}
                <div className="radio-group d-flex justify-content-center align-items-center">
                    <label className={`btn btn-outline-primary ${userType === 'HR' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            value="HR"
                            checked={userType === 'HR'}
                            onChange={handleUserTypeChange}
                        />
                        HR
                    </label>

                    {/* Add another radio button with label for another option */}
                    <label className={`btn btn-outline-primary ${userType === 'Candidate' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            value="Candidate"
                            checked={userType === 'Candidate'}
                            onChange={handleUserTypeChange}
                        />
                        Candidate
                    </label>
                </div>
                <div className="auth-content" style={{ marginBottom: "120px", overflowY: 'auto' }}> 
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
                                            routeUrl="/signin"
                                            googleHandler={() => alert("google")}
                                            facebookHandler={() => alert("facebook")}
                                        />
                                    </div>
                                </div>
                            </Col>

                            {/* Right Section */}
                            <Col md={6}>
                                <div className="p-4">
                                    {userType && (
                                        <>
                                            <h1 className="mb-3 text-18">{userType} Registration Form</h1>
                                            <p>(<span style={{ color: 'red' }}>*</span> indicates mandatory fields)</p>
                                        </>
                                    )}


                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                            <Form onSubmit={handleSubmit} className="user-registration-form">


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
                                                    disabled={disableFormFields || userType === ''}
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
                                                    disabled={disableFormFields || userType === ''}
                                                />

                                                {userType === 'HR' && (
                                                    <TextField
                                                        type="text"
                                                        name="companyName"
                                                        label={
                                                            <>
                                                                Company name <span style={{ color: 'red' }}>*</span>
                                                            </>
                                                        }
                                                        required
                                                        onBlur={handleBlur}
                                                        value={values.companyName}
                                                        onChange={handleChange}
                                                        helperText={errors.companyName}
                                                        error={errors.companyName && touched.companyName}
                                                        disabled={disableFormFields || userType === ''}
                                                    />
                                                )}

                                                {userType === 'Candidate' && (
                                                    <TextField
                                                        type="tel"
                                                        name="phone"
                                                        label="Phone Number"
                                                        value={values.phone}
                                                        onChange={handleChange}
                                                        helperText={errors.phone}
                                                        error={errors.phone && touched.phone}
                                                        fullWidth
                                                        disabled={disableFormFields || userType === ''}
                                                    />
                                                )}

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
                                                    fullWidth
                                                    disabled={disableFormFields || userType === ''}
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
                                                    onBlur={handleBlur}
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    helperText={errors.confirmPassword}
                                                    error={errors.confirmPassword && touched.confirmPassword}
                                                    fullWidth
                                                    disabled={disableFormFields || userType === ''}
                                                />
                                                {passwordCriteriaError && (
                                                    <p className="error-message">
                                                        Password should include at least one number, one special character, one capital letter, one small letter, and have a length between 8 to 12 characters
                                                    </p>
                                                )}
                                                <Button
                                                    onClick={handleShow}
                                                    disabled={agreed || userType === ''}
                                                    className="mt-3"
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        borderColor: '#007bff',
                                                        color: '#ffffff',
                                                        fontSize: '10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}

                                                >
                                                    Agree to Terms and Conditions
                                                </Button>
                                                <div className="form-check">
                                                    <Field
                                                        type="checkbox"
                                                        name="agreeToEmailValidation"
                                                        id="agreeToEmailValidation"
                                                        className="form-check-input"
                                                        checked={values.agreeToEmailValidation}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            setDisableFormFields(e.target.checked);
                                                            if (e.target.checked) {
                                                                sendOTP(values.userEmail);
                                                            }
                                                        }}
                                                        style={{ marginRight: '10px', transform: 'scale(1.4)', borderColor: 'black' }}
                                                        disabled={userType === ''}
                                                    />
                                                    <label
                                                        htmlFor="agreeToEmailValidation"
                                                        className="form-check-label"
                                                        style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '5px', verticalAlign: 'middle' }}
                                                    >
                                                        I agree to validate my email
                                                    </label>

                                                    {errors.agreeToEmailValidation && <p className="error-message">{errors.agreeToEmailValidation}</p>}
                                                </div>
                                                {emailExistsError && (
                                                    <div>
                                                        <p className="error-message">
                                                            Email already exists. Please{' '}
                                                            <Link to="/signin">click here for login</Link>
                                                        </p>
                                                        <p>OR</p>
                                                        <Button onClick={() => updateUserData(values)}>Update Your Data</Button>
                                                    </div>
                                                )}

                                                {errorMessage && <div className="text-danger">{errorMessage}</div>}

                                                <Button
                                                    type="submit"
                                                    className="btn btn-primary w-100 my-1 btn-rounded mt-3"
                                                    disabled={!otpVerified || isSubmitting || emailExistsError || !agreed || userType === ''}
                                                >
                                                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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

                                    {/* Modal for Terms and Conditions */}
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
        </div>
    );
};
export default UserRegistrationForm;
