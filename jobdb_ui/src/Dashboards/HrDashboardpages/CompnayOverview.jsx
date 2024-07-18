import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, FormGroup } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const CompnayOverview = () => {
    const BASE_API_URL = "http://localhost:8082/api/jobbox";
    const [userData, setUserData] = useState({});
    const location = useLocation();
    const userName = location.state?.userName || '';
    const userEmail = location.state?.userEmail || '';
 
  

    useEffect(() => {
        if (userEmail) {
            getUser(userEmail);
        }
    }, [userEmail]);

    const getUser = async (userEmail) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/getHRName?userEmail=${userEmail}`);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const companyName = userData.companyName;
    console.log(companyName)
   
    const [companyinfoieditMode, setCompanyInfoEditMode] = useState(false);
    const [maininfoeditMode, setMainInfoEditMode] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        overView: '',
        websiteLink: '',
        industryService: '  ',
        companySize: ' ',
        headquaters: '',
        year: '',
        specialties: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo({ ...companyInfo, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`${BASE_API_URL}/updateCompanyDetailsByHR?companyName=${companyName}`, companyInfo);
            console.log(response.data); // Log success message or handle response as needed
            setCompanyInfo({ ...companyInfo }); // Update local state with saved values
            setCompanyInfoEditMode(false); // Exit edit mode
            setMainInfoEditMode(false); // Exit edit mode
        } catch (error) {
            console.error('Error updating company details:', error);
            // Handle error state or display error message to user
        }
    };
    

      // Fetch company details when component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/getCompanyByName?companyName=${companyName}`);
        setCompanyInfo(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyName]);

  

    return (
        <div className='company-overview' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    {companyinfoieditMode ? (
                        <Form>
                            <FormGroup controlId="overView">
                                <Form.Label><h3>About the Company</h3></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="overView"
                                    value={companyInfo.overView}
                                    onChange={handleInputChange}
                                    className="fullWidthTextarea"
                                    style={{ minHeight: '150px' }}
                                />
                            </FormGroup>
                            <FormGroup controlId="websiteLink">
                                <Form.Label><h4>Website</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="websiteLink"
                                    value={companyInfo.websiteLink}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="industryService">
                                <Form.Label><h4>Industry</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="industryService"
                                    value={companyInfo.industryService}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="companySize">
                                <Form.Label><h4>Company Size</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companySize"
                                    value={companyInfo.companySize}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Form>
                    ) : (
                        <>
                            <h3>About {companyName}  <FaEdit onClick={() => setCompanyInfoEditMode(true)} style={{ cursor: 'pointer' }} /></h3>

                            <p>{companyInfo.overView}</p>
                            <h4>Website</h4>
                            <p>
                                <a href={companyInfo.websiteLink} target="_blank" rel="noopener noreferrer">
                                    {companyInfo.websiteLink}
                                </a>
                            </p>
                            <h4>Industry</h4>
                            <p>{companyInfo.industryService}</p>
                            <h4>Company Size</h4>
                            <p>{companyInfo.companySize}</p>
                        </>
                    )}
                </Card.Body>
            </Card>
            <Card style={{ marginTop: '20px' }}>
                <Card.Body>
                    {maininfoeditMode ? (
                        <Form>
                            <FormGroup controlId="headquaters">
                                <Form.Label><h4>Headquarters</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="headquaters"
                                    value={companyInfo.headquaters}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="year">
                                <Form.Label><h4>Founded</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="year"
                                    value={companyInfo.year}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="specialties">
                                <Form.Label><h4>Specialties</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="specialties"
                                    value={companyInfo.specialties}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Form>
                    ) : (
                        <>
                            <h4>Headquarters <FaEdit onClick={() => setMainInfoEditMode(true)} style={{ cursor: 'pointer' }} /></h4>
                            <p>{companyInfo.headquaters}</p>
                            <h4>Founded</h4>
                            <p>{companyInfo.year}</p>
                            <h4>Specialties</h4>
                            <p>{companyInfo.specialties}</p>
                        </>
                    )}
                </Card.Body>
            </Card>
       
        </div>
    );
};

export default CompnayOverview;


