

import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import SocialButtons from './sessions/SocialButtons';
import TextField from './sessions/TextField';

const UserRegistrationForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordCriteriaError, setPasswordCriteriaError] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [enterOtpValue, setEnterOtpValue] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [disableFormFields, setDisableFormFields] = useState(false);
    const [userType, setUserType] = useState("");

    const navigate = useNavigate();


    const initialFormValues = {
        userName: '',
        userEmail: '',
        appliedDate: getFormattedDate(),
        password: '',
        confirmPassword: '',
        agreeToTermsAndCondition: false,
        companyName: '', // Only for HR type
        phone: '', // Only for Candidate type
        companyWebsite: '',
    };

    const [formValues, setFormValues] = useState(initialFormValues);


    const location = useLocation();
    const userRole = location.state?.userType; // Get the userType from navigation state
    const companyName = location.state?.companyName;

console.log(companyName)
    useEffect(() => {
        if (userRole) {
            setUserType(userRole); // Set the default role based on userType
        }
        const storedFormValues = JSON.parse(localStorage.getItem('userRegistrationForm')) || formValues;
        setFormValues(storedFormValues);
        localStorage.setItem('userType', userRole || userType);
    }, [userRole, userType]);

    console.log("useRole", userRole)
    console.log("userType", userType)

    useEffect(() => {
        localStorage.setItem('userRegistrationForm', JSON.stringify(formValues));
    }, [formValues]);


    useEffect(() => {
        const storedUserType = localStorage.getItem('userType') || '';
        setUserType(storedUserType);

        const storedFormValues = JSON.parse(localStorage.getItem('userRegistrationForm')) || initialFormValues;
        if (Object.keys(formValues).length === 0 && formValues.constructor === Object) {
            setFormValues(storedFormValues);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('userRegistrationForm', JSON.stringify(formValues));
        localStorage.setItem('userType', userType);
    }, [formValues, userType]);


    useEffect(() => {
        // Clear localStorage when the component unmounts
        return () => {
            localStorage.removeItem('userRegistrationForm');
            localStorage.removeItem('userType');
        };
    }, []);

    const handleUserTypeChange = (type) => {
        setUserType(type);
        setFormValues(prevValues => ({
            ...prevValues,
            companyName: type === 'HR' ? prevValues.companyName : '',
            phone: type === 'Candidate' ? prevValues.phone : '',
        }));
    };

    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        userName: yup.string().required('Name is required'),
        userEmail: yup.string().email('Invalid email').required('Email is required'),
        companyName: yup.string().when('userType', {
            is: 'HR',
            then: yup.string().required('Company Name is required'),
        }),
        phone: yup.string().when('userType', {
            is: 'Candidate',
            then: yup.string(),
        }),
        password: yup
            .string()
            .required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/,
                'Password should include at least one number, one special character, one uppercase letter, one lowercase letter, and be between 8 to 12 characters'
            ),
        confirmPassword: yup.string().required('Repeat Password is required').oneOf([yup.ref('password')], 'Passwords must match'),
        agreeToTermsAndCondition: yup.bool().oneOf([true], 'You must agree to validate your email'),
    });

    // Function to handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);

        // Validate password criteria
        if (!validatePassword(values)) {
            setSubmitting(false);
            return;
        }

        values.userRole = userType;
        if (userType === 'HR') {
            values.phone = null;
        }
        if (userType === 'Candidate') {
            values.companyName = null;
        }

        try {
            const response = await axios.post('http://localhost:8082/api/jobbox/saveUser', values);

            if (!response.data || response.data === 'undefined' || response.data === '') {
                setEmailExistsError(true);
                setSubmitting(false);
                return;
            } else {
                // Show SweetAlert for registration success
                let additionalText = '';
                if (userType === 'HR') {
                    additionalText =
                        'Please check Your Mail id  ' +
                        '\n' +
                        'You can login after approved ' +
                        '\n' +
                        ' Click to visit Home';
                }
                if (userType === 'Candidate') {
                    additionalText = 'Welcome!' + '\n' + 'Click here for login';
                }
                // Show SweetAlert for registration success
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Your registration has been successful.' + (additionalText ? '\n' + additionalText : ''),
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (userType === 'HR') {
                            navigate('/');
                        } else if (userType === 'Candidate') {
                            navigate('/signin');
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error registering User:', error);
            setErrorMessage('Error registering User. Please try again later.');
        } finally {
            setSubmitting(false);
        }
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
            setErrorMessage('Passwords do not match');
            return false;
        }

        return true;
    };

    // Function to send OTP
    const sendOTP = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8082/api/jobbox/validateUserEmail?userEmail=${email}`);
            setOtpValue(response.data);
            setShowOTPModal(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrorMessage('Error sending OTP. Please try again later.');
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
            alert('Data not updated');
        }
    };

    // Function to get formatted date
    function getFormattedDate() {
        const appliedOn = new Date(); // Get current date and time
        const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
        const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
        const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month
        return `${year}-${month}-${day}`;
    }

    return (
        <div>
            <div className="auth-layout-wrap" style={{ overflow: 'hidden' }}>
                <h1 className="heading">User Registration</h1>

                {userType === '' && (
                    <p style={{ color: 'red', textAlign: 'center' }}>Please select a user type below to proceed with the form.</p>
                )}

                <div className="button-group d-flex justify-content-center align-items-center">
                    <button
                        type="button"
                        className={`btn ${userType === 'HR' ? 'btn-primary active' : 'btn-secondary'}`}
                        onClick={() => handleUserTypeChange('HR')}
                        style={{ marginRight: '12px' }}
                        disabled={userType === 'Candidate'}
                    >
                        HR
                    </button>
                    <button
                        type="button"
                        className={`btn ${userType === 'Candidate' ? 'btn-primary active' : 'btn-secondary'}`}
                        onClick={() => handleUserTypeChange('Candidate')}
                        disabled={userType === 'HR'}
                    >
                        Candidate
                    </button>
                </div>
                {userType && (
                    <>
                        <h1 className="mb-3 text-18">{userType} Registration Form</h1>
                        <p>(<span style={{ color: 'red' }}>*</span> indicates mandatory fields)</p>

                        <Formik
                            initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                <Form className='form' style={{ Width: '800px' }} >
                                    <Card className="form-card " >
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
                                            <Col md={6}>
                                                <TextField
                                                    type="text"
                                                    name="userName"
                                                    label={
                                                        <>
                                                            Your name <span style={{ color: 'red' }}>*</span>
                                                        </>
                                                    }
                                                    required
                                                    placeholder="Enter your name"
                                                    value={values.userName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={errors.userName}
                                                    error={errors.userName && touched.userName}
                                                    errorMessage={touched.userName && errors.userName}
                                                    disabled={disableFormFields}
                                                />

                                                <TextField
                                                    type="email"
                                                    name="userEmail"
                                                    label={
                                                        <>
                                                            {userType === 'HR' ? 'Your Official Company Email' : 'Your Email'}
                                                            <span style={{ color: 'red' }}>*</span>
                                                        </>
                                                    }
                                                    required
                                                    placeholder="Enter your email"
                                                    value={values.userEmail}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={errors.userEmail}
                                                    error={errors.userEmail && touched.userEmail}
                                                    errorMessage={touched.userEmail && errors.userEmail}
                                                    disabled={disableFormFields || emailExistsError}
                                                />


                                                {userType === 'HR' && (
                                                    <>

                                                        <TextField
                                                            type="text"
                                                            name="companyName"
                                                            label={
                                                                <>
                                                                    Company name <span style={{ color: 'red' }}>*</span>
                                                                </>
                                                            }
                                                            required
                                                            placeholder="Enter your company name"
                                                            value={values.companyName || companyName}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            helperText={errors.companyName}
                                                            error={errors.companyName && touched.companyName}
                                                            errorMessage={touched.companyName && errors.companyName}
                                                            disabled={disableFormFields}
                                                        />
                                                        <TextField
                                                            type="text"
                                                            name="companyWebsite"
                                                            label={
                                                                <>
                                                                    Company Website <span style={{ color: 'red' }}>*</span>
                                                                </>
                                                            }
                                                            required
                                                            placeholder="Enter your company website"
                                                            value={values.companyWebsite}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                let formattedValue = value.trim();

                                                                // Add 'https://' prefix if not already present
                                                                if (!formattedValue.startsWith('https://') && !formattedValue.startsWith('http://')) {
                                                                    formattedValue = `https://${formattedValue}`;
                                                                }

                                                                // Add '.com' suffix if not already present
                                                                if (!formattedValue.endsWith('.com')) {
                                                                    formattedValue += '.com';
                                                                }

                                                                handleChange({
                                                                    target: {
                                                                        name: 'companyWebsite',
                                                                        value: formattedValue,
                                                                    }
                                                                });
                                                            }}
                                                            onBlur={handleBlur}
                                                            helperText={errors.companyWebsite}
                                                            error={errors.companyWebsite && touched.companyWebsite}
                                                            disabled={disableFormFields}
                                                        />

                                                    </>
                                                )}

                                                {userType === 'Candidate' && (

                                                    <TextField
                                                        type="text"
                                                        name="phone"
                                                        label="Phone Number"
                                                        required
                                                        placeholder="Enter your phone number"
                                                        value={values.phone}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        helperText={errors.phone}
                                                        error={errors.phone && touched.phone}
                                                        fullWidth
                                                        errorMessage={touched.phone && errors.phone}
                                                        disabled={disableFormFields}
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
                                                    placeholder="Enter your password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={errors.password}
                                                    error={errors.password && touched.password}
                                                    fullWidth
                                                    errorMessage={touched.password && errors.password}
                                                    disabled={disableFormFields}
                                                />
                                                {passwordCriteriaError && (
                                                    <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                        Password should include at least one number, one special character, one uppercase letter, one lowercase letter, and be between 8 to 12 characters
                                                    </p>
                                                )}

                                                <TextField
                                                    type="password"
                                                    name="confirmPassword"
                                                    label={
                                                        <>
                                                            Confirm Password <span style={{ color: 'red' }}>*</span>
                                                        </>
                                                    }
                                                    required
                                                    placeholder="Re-enter your password"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={errors.password}
                                                    error={errors.password && touched.password}
                                                    fullWidth
                                                    errorMessage={touched.confirmPassword && errors.confirmPassword}
                                                    disabled={disableFormFields}
                                                />
                                                <Button
                                                    disabled={disableFormFields || userType === '' || otpVerified}
                                                    className="mt-3"
                                                    onClick={(e) => {
                                                        handleChange(e);

                                                        sendOTP(values.userEmail);

                                                    }}
                                                >
                                                    validate my email
                                                </Button>

                                                <div className="form-group form-check">
                                                    <Field
                                                        type="checkbox"
                                                        name="agreeToTermsAndCondition"
                                                        // className={`form-check-input ${touched.agreeToTermsAndCondition && errors.agreeToTermsAndCondition ? 'is-invalid' : ''}`}
                                                        id="agreeToTermsAndCondition"
                                                        checked={values.agreeToTermsAndCondition}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            setDisableFormFields(e.target.checked);

                                                        }}
                                                        style={{ marginRight: '10px', transform: 'scale(1)', borderColor: 'black' }}
                                                        disabled={userType === ''}

                                                    />
                                                    <label className="form-check-label" htmlFor="agreeToTermsAndCondition">
                                                        I agree to the{' '}
                                                        <Link to="/terms-and-conditions" target="_blank">
                                                            Terms and Conditions
                                                        </Link>{' '}
                                                        of the website
                                                    </label>
                                                    {touched.agreeToTermsAndCondition && errors.agreeToTermsAndCondition && (
                                                        <div className="invalid-feedback">{errors.agreeToTermsAndCondition}</div>
                                                    )}
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
                                                    disabled={!otpVerified || isSubmitting || emailExistsError || userType === ''}
                                                >
                                                    {isSubmitting ? 'Registering...' : 'Register'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                    </>
                )}

                {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </div>

            {/* OTP Modal */}
            <Modal show={showOTPModal} onHide={() => setShowOTPModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>OTP Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>An OTP has been sent to your email. Please enter it below:</p>
                    <TextField
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={enterOtpValue}
                        onChange={(e) => setEnterOtpValue(e.target.value)}
                    />
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

export default UserRegistrationForm;



