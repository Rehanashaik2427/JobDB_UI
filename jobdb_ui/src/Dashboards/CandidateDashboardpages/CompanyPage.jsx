import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './CandidateDashboard.css';
import CandidateLeftSide from "./CandidateLeftSide";
import { Col, Container, Row } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

const CompamyPage = () => {

  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();

  const companyId = location.state?.companyId; // Access companyId from URL parameter
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [company, setCompany] = useState();
  const [countOfApplications, setCountOfApplications] = useState();
  const [countOfHR, setCountOfHR] = useState();
  const [countOfJobs, setCountOfJobs] = useState();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCompany();
    fetchCountOfApplicationByCompany();
    fetchCountOfHRByCompany();
    fetchCountOfJobsByCompany();
  }, [companyId]);

  const user = {
    userName: userName,
    userId: userId,
  };

  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };
  return (
 <Container fluid className='dashboard-container'>
      <Row>
      <Col md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <CandidateLeftSide user={{ userName, userId }} />
        </Col>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>

        <Col md={18} className="rightside">
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
            </div>
          ) : (
            <p>Loading company details...</p>
          )}
        </div>
        </Col>
      </Row>
    </Container>
  );
};


export default CompamyPage;
