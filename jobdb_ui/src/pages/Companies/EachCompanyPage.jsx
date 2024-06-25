import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';

const EachCompanyPage = (props) => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const companyId = location.state?.companyId; // Access companyId from URL parameter

  const [company, setCompany] = useState(null);
  const [countOfApplications, setCountOfApplications] = useState();
  const [countOfHR, setCountOfHR] = useState();
  const [countOfJobs, setCountOfJobs] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchCountOfApplicationByCompany();
      fetchCountOfHRByCompany();
      fetchCountOfJobsByCompany();
    }
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/displayCompanyById?companyId=${companyId}`
      );
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const fetchCountOfApplicationByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/countOfApplicationsByCompany?companyId=${companyId}`
      );
      setCountOfApplications(response.data);
    } catch (error) {
      console.error('Error fetching count of applications:', error);
    }
  };

  const fetchCountOfHRByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/countOfHRByCompany?companyId=${companyId}`
      );
      setCountOfHR(response.data);
    } catch (error) {
      console.error('Error fetching count of HRs:', error);
    }
  };

  const fetchCountOfJobsByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/countOfJobsByCompany?companyId=${companyId}`
      );
      setCountOfJobs(response.data);
    } catch (error) {
      console.error('Error fetching count of jobs:', error);
    }
  };

  const navigateToHRRegister = () => {
    if (company) {
      navigate({ pathname: '/signup/hrSignup', state: { companyName: company.companyName } });
    }
  };

  const navigateToHRSignin = () => {
    if (company) {
      navigate({ pathname: '/signin', state: { companyName: company.companyName } });
    }
  };
  const handleBack = () => {
    navigate("/jobdbcompanies"); // Navigate back to previous page
  };

  return (
    <Container>
        <Col xs={6}>
       <Button onClick={handleBack} variant="secondary">
            <FontAwesomeIcon icon={faArrowLeft} /> 
          </Button>

        </Col>
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="companyPage">
            {company ? (
              <div>
                <h2>Company Name: {company.companyName}</h2>
                <p>{company.description}</p>
                <p>{company.jobboxEmail}</p>
                <p>Total Applications: {countOfApplications}</p>
                {countOfHR > 0 ? (
                  <p>HR mapped = Yes</p>
                ) : (
                  <p>HR mapped = No</p>
                )}
                <p>Total HRs Join: {countOfHR}</p>
                <p>Total Jobs Posted By HRs: {countOfJobs}</p>
                <div>
                  <h2>To View the Applications please</h2>
                  <div className="company-buttons">
                    <Button onClick={navigateToHRRegister}>Claim as HR</Button>
                    <Button onClick={navigateToHRSignin}>Login</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>Loading company details...</p>
                <Spinner animation="border" variant="primary" className="m-5" />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EachCompanyPage;
