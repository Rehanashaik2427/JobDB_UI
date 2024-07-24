import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, FormGroup } from 'react-bootstrap';
import { FaEdit, FaFacebook, FaInstagramSquare, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import AdminleftSide from './AdminleftSide';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CompanyDetailsByAdmin = () => {
  const [editableCompanyDetails, setEditableCompanyDetails] = useState(false);
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    industry: '',
    location: '',
    discription: '',
    headquaters: '',
    overView: '',
    websiteLink: '',
    companySize: '',
    industryService: '',
    year: '',
    specialties: ''
  });


  const navigate = useNavigate();
  const location = useLocation();

  const companyName = location.state?.companyName;

  // Fetch company details when component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/getCompanyByName?companyName=${companyName}`);
        setCompanyDetails(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_API_URL}/updateCompanyDetailsByAdmin?companyName=${companyName}`, companyDetails);
      console.log(response.data); // Log success message or handle response as needed
      setCompanyDetails({ ...companyDetails }); // Update local state with saved values
      setEditableCompanyDetails(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating company details:', error);
      // Handle error state or display error message to user
    }
  };


  const [activeTab, setActiveTab] = useState('home'); // State to control the active tab


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleCameraIconClick = (type) => {
    document.getElementById(`${type}Input`).click();
  };
  const handleFileChange = async (type, file) => {
    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('file', file);

    try {
      const response = await axios.post(
        type === 'logo' ? `${BASE_API_URL}/uploadLogo` : `${BASE_API_URL}/uploadBanner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          setCompanyLogo(reader.result);
        } else {
          setCompanyBanner(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const fetchCompanyLogo = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/logo`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyLogo(image);
    } catch (error) {
      console.error('Error fetching company logo:', error);
    }
  };

  const fetchCompanyBanner = async (companyName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/banner`, { params: { companyName }, responseType: 'arraybuffer' });
      const image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )}`;
      setCompanyBanner(image);
    } catch (error) {
      console.error('Error fetching company banner:', error);
    }
  };

  useEffect(() => {
    if (companyName) {
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);
    }
  }, [companyName])


  const handleCompanyIconClick = (socialMedia) => {
    let url;
    switch (socialMedia) {
      case 'Facebook':
        url = `https://www.facebook.com/${companyName}`;
        break;
      case 'Twitter':
        url = `https://twitter.com/${companyName}`;
        break;
      case 'Instagram':
        url = `https://www.instagram.com/${companyName}`;
        break;
      case 'LinkedIn':
        url = `https://www.linkedin.com/company/${companyName}`;
        break;
      default:
        url = '';
    }
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  return (
    <div className='dashboard-container'>
      <div className='left-side'>
        <AdminleftSide />
      </div>
      <div className="rightside" style={{ overflowY: 'hidden' }}>
        <Card style={{ width: '100%', height: '60%' }}>
          <Card.Body style={{ padding: 0, position: 'relative' }}>
            <div style={{ position: 'relative', height: '55%' }}>
              <img
                src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                alt="Company Banner"
                className="banner-image"
                onClick={() => handleCameraIconClick('banner')}
                style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
              <input
                id="bannerInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('banner', e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{ width: '200px', height: '120px', cursor: 'pointer', border: '5px solid white', borderRadius: '50%' }}
                onClick={() => handleCameraIconClick('logo')}
              />
              <input
                id="logoInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange('logo', e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div>
              <h1 style={{ position: 'absolute', top: '70%', right: '100px' }}>{companyName}</h1>
              <div className='social-icons-company' style={{ position: 'absolute', top: '85%', right: '100px' }}>
                <FaFacebook
                  onClick={() => handleCompanyIconClick('Facebook')}
                  style={{ fontSize: '30px', cursor: 'pointer', color: '#4267B2',marginRight:'10px' }}
                />
                <FaTwitter
                  onClick={() => handleCompanyIconClick('Twitter')}
                  style={{ fontSize: '30px', cursor: 'pointer', color: '#1DA1F2' ,marginLeft:'10px',marginRight:'10px'}}
                />
                <FaInstagramSquare
                  onClick={() => handleCompanyIconClick('Instagram')}
                  style={{ fontSize: '30px', cursor: 'pointer', color: '#C13584',marginLeft:'10px',marginRight:'10px' }}
                />
                <FaLinkedin
                  onClick={() => handleCompanyIconClick('LinkedIn')}
                  style={{ fontSize: '30px', cursor: 'pointer', color: '#0077B5',marginLeft:'10px'}}
                />
              </div>

            </div>
            <h3 style={{ position: 'absolute', top: '80%'}}>About {companyName}</h3>
          </Card.Body>
        </Card>
        {editableCompanyDetails ? (
          <Form className='company-overview-by-admin'>
            <FormGroup controlId="overView">
              <Form.Label>
                <h3>Overview</h3>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="overView"
                value={companyDetails.overView}
                onChange={handleInputChange}
                className="fullWidthTextarea"
                style={{ minHeight: '150px' }}
              />
            </FormGroup>
            <FormGroup controlId="websiteLink">
              <Form.Label>
                <h4>Website</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="websiteLink"
                value={companyDetails.websiteLink}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="industry">
              <Form.Label>
                <h4>Industry Type</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="industry"
                value={companyDetails.industry}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="description">
              <Form.Label>
                <h4>Description</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={companyDetails.discription}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="industryService">
              <Form.Label>
                <h4>Industry Service</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="industryService"
                value={companyDetails.industryService}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="companySize">
              <Form.Label>
                <h4>Company Size</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="companySize"
                value={companyDetails.companySize}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="headquarters">
              <Form.Label>
                <h4>Headquarters</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="headquarters"
                value={companyDetails.headquaters}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="year">
              <Form.Label>
                <h4>Founded</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="year"
                value={companyDetails.year}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="location">
              <Form.Label>
                <h4>Location</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={companyDetails.location}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="specialties">
              <Form.Label>
                <h4>Specialties</h4>
              </Form.Label>
              <Form.Control
                type="text"
                name="specialties"
                value={companyDetails.specialties}
                onChange={handleInputChange}
              />
            </FormGroup>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Form>
        ) : (
          <>
          <div className='company-overview-by-admin'>
            <h3>
              About 
              <FaEdit onClick={() => setEditableCompanyDetails(true)} style={{ cursor: 'pointer' }} />
            </h3>
            <p>{companyDetails.overView}</p>
            <h4>Website</h4>
            <p>
              <a href={companyDetails.websiteLink} target="_blank" rel="noopener noreferrer">
                {companyDetails.websiteLink}
              </a>
            </p>
            <h4>Industry Type</h4>
            <p>{companyDetails.industry}</p>
            <h4>Description</h4>
            <p>{companyDetails.discription}</p>
            <h4>Industry Service</h4>
            <p>{companyDetails.industryService}</p>
            <h4>Company Size</h4>
            <p>{companyDetails.companySize === 0 ? '' : companyDetails.companySize}</p>
            <h4>Headquarters</h4>
            <p>{companyDetails.headquaters}</p>
            <h4>Founded</h4>
            <p>{companyDetails.year === 0 ? '' : companyDetails.year}</p>
            <h4>Location</h4>
            <p>{companyDetails.location}</p>
            <h4>Specialties</h4>
            <p>{companyDetails.specialties}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsByAdmin;
