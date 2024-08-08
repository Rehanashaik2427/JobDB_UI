import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResumeSelectionPopup from './ResumeSelectionPopup';


const JobDescription = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const { companyName, jobId, userId } = location.state;
  const [applyjobs, setApplyJobs] = useState();
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [unappliedJobs, setUnappliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4); // Default page size
  const [totalPages, setTotalPages] = useState(0)
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [jobDetails, setJobDetails] = useState({
    jobTitle: '',
    jobType: '',
    skills: '',
    postingDate: '',
    numberOfPosition: '',
    salary: '',
    jobsummary: '',
    applicationDeadline: '',
  })
  useEffect(() => {
    if (companyName) {
      fetchCompanyLogo(companyName);
      fetchCompanyBanner(companyName);
      fetchJobsByCompany(companyName)
    }
  }, [companyName, page, pageSize]);

  

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
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);
  const fetchJobDetails = async (id) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getJob`, { params: { jobId: id } });
      setJobDetails(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  async function fetchJobsByCompany() {
    try {
      const params = {
        page: page,
        size: pageSize,
        companyName: companyName
      };
      const response = await axios.get(`${BASE_API_URL}/getJobsByCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleApplyButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowResumePopup(true);
  };

  const applyJob = async (jobId, resumeId) => {
    let loadingPopup;

    try {
      // Show loading message using SweetAlert
      loadingPopup = Swal.fire({
        title: 'Applying to the job...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const appliedOn = new Date(); // Get current date and time
      const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
      const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
      const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

      const formattedDate = `${year}-${month}-${day}`;  

      const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
        params: { jobId, userId, formattedDate, resumeId },
      });

      if (response.data) {
        setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, formattedDate }]);
        setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));

        // Close the loading popup
        Swal.close();

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      // Close loading popup on error
      if (loadingPopup) {
        Swal.close();
      }
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    } finally {
      // Ensure loading popup is closed if still open
      if (loadingPopup) {
        Swal.close();
      }
    }
  };

  const handleResumeSelect = async (resumeId) => {
    if (selectedJobId && resumeId) {
      await applyJob(selectedJobId, resumeId);
      setSelectedJobId(null);
      setShowResumePopup(false);
    }
  };

  useEffect(() => {
    axios.get(`${BASE_API_URL}/getResume`, { params: { userId } })
      .then(response => {
        setResumes(response.data);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  }, [userId]);


  useEffect(() => {
    if (jobId && userId) {
      checkIfApplied(jobId, userId);
    }
  }, [jobId, userId]);

  const checkIfApplied = async (jobId, userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/applicationApplied`, { params: { jobId, userId } });
      setHasUserApplied(response.data);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  useEffect(() => {
    const filterUnappliedJobs = jobs.filter(job => !hasUserApplied[job.jobId] && job.jobId !== selectedJobId);
    setUnappliedJobs(filterUnappliedJobs);
  }, [jobs, hasUserApplied, selectedJobId]);

  const handleOtherJobClick = (jobId) => {
    fetchJobDetails(jobId);
    setSelectedJobId(jobId);
  };
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" style={{ width: '100%' }}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/jb_logo.png"
              alt="JobBox Logo"
              className="logo"
              style={{
                backgroundColor: 'transparent'
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" style={{ marginRight: '100px', marginLeft: '200px' }}>Home</Nav.Link>
              <Nav.Link as={Link} to='/about-jobbox' style={{ marginRight: '100px' }}>About Jobbox</Nav.Link>
              <Nav.Link as={Link} to="/aboutus" style={{ marginRight: '100px' }}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/jobdbcompanies" style={{ marginRight: '100px' }}>Companies</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showResumePopup && (
        <ResumeSelectionPopup
          resumes={resumes}
          onSelectResume={handleResumeSelect}
          onClose={() => setShowResumePopup(false)}
        />
      )}
      <div>
        <Card style={{ width: '100%', height: '60%' }}>
          <Card.Body style={{ padding: 0, position: 'relative' }}>
            <div style={{ position: 'relative', height: '55%' }}>
              <img
                src={companyBanner || "https://cdn.pixabay.com/photo/2016/04/20/07/16/logo-1340516_1280.png"}
                alt="Company Banner"
                className="banner-image"
                style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              />
            </div>
            <div style={{ position: 'absolute', top: '100%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{
                  width: '18vw', // Adjust width to 20% of viewport width
                  height: 'auto', // Maintain aspect ratio
                  maxWidth: '150px', // Optional: max-width to avoid it growing too large
                  cursor: 'pointer',
                  border: '5px solid white',
                  borderRadius: '50%',
                  objectFit: 'cover', // Ensure the image covers the given width and height without distortion
                }} />
            </div>
          </Card.Body>
        </Card>
      </div><br></br><br></br>
      <hr style={{ backgroundColor: 'black' }} />
      <Container style={{ width: '100vw', position: 'absolute', top: '68%' }}>
        <Row>
          <Col lg={9}>
            <Card>
              <Card.Header>
                <Card.Title style={{ height: '30px' }}>
                  <h2 style={{ position: 'relative', top: '8%' }}>Job Description</h2>

                  {/* <Button onClick={() => handleApplyButtonClick(jobId)} style={{ position: 'relative', bottom: '100%', left: '90%' }}>Apply</Button> */}
                  {hasUserApplied ? (
                    <p style={{ position: 'relative', bottom: '100%', left: '90%', color: 'green' }}><strong>Applied</strong></p>
                  ) : (
                    <Button style={{ position: 'relative', bottom: '100%', left: '90%' }} onClick={() => handleApplyButtonClick(jobId)}>Apply</Button>
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <p><strong>Job Type:</strong> {jobDetails.jobTitle}</p>
                <p><strong>Job Type:</strong> {jobDetails.jobType}</p>
                <p><strong>Skills:</strong> {jobDetails.skills}</p>
                <p><strong>Posting Date:</strong> {jobDetails.postingDate}</p>
                <p><strong>Number of Positions:</strong> {jobDetails.numberOfPosition}</p>
                <p><strong>Salary:</strong> {jobDetails.salary}</p>
                <strong>Job Summary:</strong> <pre className="job-details-text">{jobDetails.jobsummary}</pre>
                <p><strong>Application Deadline:</strong> {jobDetails.applicationDeadline}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card>
              <Card.Title>
                <h3 style={{ marginTop: '20px', marginLeft: '12px', fontSize: '24px' }}>Other Jobs
                  <Button style={{ position: 'relative', left: '27%', marginTop: '12px' }}>Apply</Button>
                </h3>
              </Card.Title>
              {unappliedJobs.map((job) => (
                <Card key={job.jobId} style={{ margin: '12px', width: '400px' }}>
                  <Card.Body onClick={() => handleOtherJobClick(job.jobId)}>
                    <Card.Title>{job.jobTitle} ({job.jobType})</Card.Title>
                    <Card.Text><strong>Application Deadline:</strong> {job.applicationDeadline}<br /></Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Card>
            <div className="pagination-container d-flex justify-content-end align-items-start" style={{ position: 'relative', left: '90%', marginTop: '12px' }}>
              <div className="page-size-select me-3">
                <select id="pageSize" onChange={handlePageSizeChange} value={pageSize} disabled={isPageSizeDisabled}>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
              <ReactPaginate
                previousLabel={<i className="i-Previous" />}
                nextLabel={<i className="i-Next1" />}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                activeClassName="active"
                containerClassName="pagination"
                subContainerClassName="pages pagination"
              />
            </div>
          </Col>

        </Row>

        <Row style={{ backgroundColor: 'black', height: '90px', width: '100vw' }}>
          <Card.Footer className="d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <div>
                <h2 style={{ color: 'white' }}>
                  Powered by <strong style={{ color: 'purple' }}>JOB</strong><strong style={{ color: 'gainsboro' }}>BOX</strong> © 2024 Paaratech Inc. All rights reserved.
                </h2>
              </div>
              <div className="mt-2">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaInstagram size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#C13584', margin: '5px' }} />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaFacebook size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#4267B2', margin: '5px' }} />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaTwitter size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#1DA1F2', margin: '5px' }} />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none mx-2">
                  <FaLinkedin size={30} style={{ fontSize: 'clamp(24px, 4vw, 30px)', cursor: 'pointer', color: '#0077B5', margin: '5px' }} />
                </a>
              </div>
            </div>
          </Card.Footer>
        </Row>
      </Container>

    </div>

  );
};

export default JobDescription;
