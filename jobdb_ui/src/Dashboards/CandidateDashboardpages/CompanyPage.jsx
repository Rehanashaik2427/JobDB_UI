import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './CandidateDashboard.css';
import CandidateLeftSide from "./CandidateLeftSide";
import ResumeSelectionPopup from "./ResumeSelectionPopup";

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
  const [activeTab, setActiveTab] = useState('home'); // State to control the active tab
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyBanner, setCompanyBanner] = useState("");
  const [jobs, setJobs] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [applyjobs, setApplyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [hasDreamApplied, setHasDreamApplied] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [countOfTotalJobs, setCountOfTotalJobs] = useState();
  const [countOfshortlistedApplications, setCountOfshortlistedApplications] = useState();
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState({
    overView: '',
    websiteLink: '',
    industryService: '',
    companySize: '',
    headquaters: '',
    year: '',
    specialties: '',
  });

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

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getCompanyByName?companyName=${company?.companyName}`);
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  useEffect(() => {
    if (company?.companyName) {
      fetchCompanyDetails();
      fetchCompanyLogo(company?.companyName);
      fetchCompanyBanner(company?.companyName);
      fetchCountOfShortlistedCandidatesByCompany(userId, company?.companyName)
    }
  }, [company?.companyName, userId]);

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

  const fetchCountOfTotalJobsByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/countOfTotalJobsByCompany?companyId=${companyId}`
      );
      setCountOfTotalJobs(response.data);
    } catch (error) {
      console.error('Error fetching count of jobs:', error);
    }
  };

  const fetchCountOfShortlistedCandidatesByCompany = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/getCountOfTotalShortlistedApplicationCompany?userId=${userId}&companyName=${company?.companyName}`
      );
      setCountOfshortlistedApplications(response.data);
    } catch (error) {
      console.error('Error fetching count of jobs:', error);
    }
  };


  useEffect(() => {
    fetchCountOfApplicationByCompany();
    fetchCountOfHRByCompany();
    fetchCountOfJobsByCompany();
    fetchCountOfTotalJobsByCompany()
  }, [companyId]);

  const [showLeftSide, setShowLeftSide] = useState(false);

  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };


  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };
  const closeJobDescription = () => {
    setShowJobDescription(false);
    setSelectedJobSummary('');
  };
  const popover = (summary) => (
    <Popover id="popover-basic" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <Popover.Body>
        {summary}
        <span className="float-end" onClick={closeJobDescription} style={{ cursor: 'pointer' }}>

        </span>
      </Popover.Body>
    </Popover>
  );
  useEffect(() => {

    fetchJobsByCompany();

  }, [company?.companyName, page, pageSize, sortedColumn, sortOrder]);

  async function fetchJobsByCompany() {
    try {
      const params = {
        companyName: company?.companyName,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/getJobsPaginationByCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const applyDreamCompanyJob = async (resumeId) => {
    const appliedOn = new Date(); // Get current date and time
    const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
    const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); // Output: 2024-07-09 (example for today's date)

    try {
      const response = await axios.put(`${BASE_API_URL}/applyDreamCompany?userId=${userId}&companyName=${company?.companyName}&formattedDate=${formattedDate}&resumeId=${resumeId}`);
      console.log(response.data);
      if (response.data) {
        alert("You have successfully applied for this job");
        // setShowMessage(true);
        checkHasUserDreamApplied();
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }

  };

  const applyJob = async (jobId, resumeId) => {
    const appliedOn = new Date(); // Get current date and time
    const year = appliedOn.getFullYear(); // Get the full year (e.g., 2024)
    const month = String(appliedOn.getMonth() + 1).padStart(2, '0'); // Get month (January is 0, so we add 1)
    const day = String(appliedOn.getDate()).padStart(2, '0'); // Get day of the month

    const formattedDate = `${year}-${month}-${day}`;

    try {
      const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
        params: { jobId, userId, formattedDate, resumeId },
      });
      if (response.data) {
        setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, formattedDate }]);
        setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));

        await Swal.fire({
          icon: "success",
          title: "Apply Successful!",
          text: "You have successfully applied for this job."
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
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
    checkHasUserApplied();
  }, [jobs, userId]);

  const checkHasUserApplied = async () => {
    const applications = {};
    try {
      for (const job of jobs) {
        const response = await axios.get(`${BASE_API_URL}/applicationApplied`, {
          params: { jobId: job.jobId, userId }
        });
        applications[job.jobId] = response.data;
      }
      setHasUserApplied(applications);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };
  useEffect(() => {
    checkHasUserDreamApplied();
  }, [company?.companyName, userId]);
  const checkHasUserDreamApplied = async () => {

    try {

      const response = await axios.get(`${BASE_API_URL}/applicationDreamAplied`, {
        params: { userId, companyName: company?.companyName }
      });
      setHasDreamApplied(response.data);


    } catch (error) {
      console.error('Error checking application:', error);
    }
  };
  const handleApplyButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowResumePopup(true);
  };

  const handleApplyCompany = () => {
    setShowResumePopup(true);
  }
  const handleResumeSelect = async (resumeId) => {
    if (selectedJobId && resumeId) {
      await applyJob(selectedJobId, resumeId);
      setSelectedJobId(null);
    } else {
      await applyDreamCompanyJob(resumeId);
    }
    setShowResumePopup(false);

  };
  return (
    <div fluid className='dashboard-container'>
      <div md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <CandidateLeftSide user={{ userName, userId }} />
      </div>
      <div className="hamburger-icon" onClick={toggleLeftSide}>
        <FaBars />
      </div>

      <div md={10} className="rightside" style={{
        overflowY: 'scroll'
      }}>
        {showResumePopup && (

          <ResumeSelectionPopup
            resumes={resumes}
            onSelectResume={handleResumeSelect}
            onClose={() => setShowResumePopup(false)}
          />

        )}
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
            <div style={{ position: 'absolute', top: '55%', left: '50px', transform: 'translateY(-50%)' }}>
              <img
                src={companyLogo || "https://static.vecteezy.com/system/resources/previews/013/899/376/original/cityscape-design-corporation-of-buildings-logo-for-real-estate-business-company-vector.jpg"}
                alt="Company Logo"
                className="logo-image"
                style={{ width: '200px', height: '120px', cursor: 'pointer', border: '5px solid white', borderRadius: '50%' }}
              />
            </div>
            <div><h1 style={{ position: 'absolute', top: '70%', right: '100px' }}>{company?.companyName}</h1></div>
            <ul className="nav-links" style={{ position: 'absolute', top: '80%', left: '50px', listStyleType: 'none', display: 'flex' }}>
              <li>
                <span>
                  <a onClick={() => setActiveTab('overview')} style={{ paddingLeft: '24px', fontSize: '24px', color: activeTab === 'overview' ? 'purple' : 'gray', cursor: 'pointer' }}>
                    About
                  </a>
                </span>
              </li>
              <li>
                <span>
                  <a onClick={() => setActiveTab('jobs')} style={{ paddingLeft: '24px', fontSize: '24px', color: activeTab === 'jobs' ? 'purple' : 'gray', cursor: 'pointer' }}>
                    Jobs
                  </a>
                </span>
              </li>
            </ul>
          </Card.Body>
        </Card>

        <Row>
          <Col xs={8}>
            {activeTab === 'home' && (
              <div>
                <Card onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                  <Card.Body>
                    <h3>About {company?.companyName}</h3>
                    <p>Click to view Overview content...</p>
                  </Card.Body>
                </Card>
                <Card onClick={() => setActiveTab('jobs')} style={{ cursor: 'pointer', marginTop: '20px' }}>
                  <Card.Body>
                    <h3>Jobs</h3>
                    <p>Click to view Jobs content...</p>
                  </Card.Body>
                </Card>
              </div>
            )}
            {activeTab === 'overview' && (
              <>
                <div className='company-overview' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  <Card>
                    <Card.Body>
                      <h3>About {company?.companyName} </h3>
                      <p><strong>Overview:</strong> {companyInfo.overView}</p>
                      <p><strong>Website:</strong> <a href={companyInfo.websiteLink} target="_blank" rel="noopener noreferrer">{companyInfo.websiteLink}</a></p>
                      <p><strong>Industry Service:</strong> {companyInfo.industryService}</p>
                      <p><strong>Company Size:</strong> {companyInfo.companySize}</p>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <p><strong>Headquarters:</strong> {companyInfo.headquaters}</p>
                      <p><strong>Year Founded:</strong> {companyInfo.year}</p>
                      <p><strong>Specialties:</strong> {companyInfo.specialties}</p>
                    </Card.Body>
                  </Card>
                </div>
              </>
            )}
            {activeTab === 'jobs' && (
              <div className="company-job" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <Table hover className='text-center' style={{ marginLeft: '5px', marginRight: '12px' }}>
                  <thead className="table-light">
                    <tr>
                      <th scope='col' onClick={() => handleSort('jobTitle')}>
                        Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>

                      <th scope='col' onClick={() => handleSort('applicationDeadline')}>
                        Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope='col' onClick={() => handleSort('skills')}>
                        Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                      <th scope='col'>Job Summary</th>
                      <th scope='col'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id} id='job-table-list'>
                        <td>{job.jobTitle}</td>
                        <td>{job.applicationDeadline}</td>
                        <td>{job.skills}</td>
                        <td>
                          <OverlayTrigger trigger="click" placement="left" overlay={popover(job.jobsummary)} style={{ fontSize: '20px' }}>
                            <Button variant="secondary" className='description btn-rounded' >View Summary</Button>
                          </OverlayTrigger>
                        </td>
                        <td>
                          {hasUserApplied[job.jobId] === true || (applyjobs && applyjobs.jobId === job.jobId) ? (
                            <p>Applied</p>
                          ) : (
                            <Button onClick={() => handleApplyButtonClick(job.jobId)}>Apply</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination-container d-flex justify-content-end align-items-center">
                  <div className="page-size-select me-3">
                    <label htmlFor="pageSize">Page Size:</label>
                    <select id="pageSize" onChange={handlePageSizeChange} value={pageSize}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
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
              </div>
            )}
          </Col>

          <Col>
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Row className="mb-3">

                  <Col>
                    {hasDreamApplied === true ? (
                      <p style={{
                        color: '#28a745', /* Green color for the text */
                        fontSize: '18px', /* Larger font size */
                        fontWeight: 'bold', /* Bold text */
                        backgroundColor: '#e9f5e9', /* Light green background color */
                        padding: '10px', /* Padding around the text */
                        borderRadius: '5px', /* Rounded corners */
                        textAlign: 'center', /* Center-align the text */
                        margin: '10px 0', /* Margin above and below the paragraph */
                        boxShadow: 'rgba(0, 0, 0, 0.1)' /* Subtle shadow effect */
                      }}>
                        Applied
                      </p>

                    ) : (
                      <Button variant="success" onClick={handleApplyCompany}>Apply</Button>
                    )}

                  </Col>
                </Row>
                <h1>Other Information</h1>
                <Row className="mb-2">

                  <Col>
                    <h5>Applicants: {countOfApplications}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total HR's: {countOfHR}</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h5>Total Jobs:{countOfTotalJobs}</h5>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <h5>Key Stats:</h5>
                    <ul>
                      <li>Active Job Postings:{countOfJobs}</li> {/* Placeholder values */}
                      <li>Shortlisted Applications:{countOfshortlistedApplications} </li>
                      <li>Avg. Time to Fill a Job: 7 days</li>
                      {/* <li>Top Searched Job: Software Engineer</li>
                        <li>User Engagement: 75% daily active users</li> */}
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>


          </Col>
        </Row>


      </div>
    </div>
  );
};

export default CompamyPage;
