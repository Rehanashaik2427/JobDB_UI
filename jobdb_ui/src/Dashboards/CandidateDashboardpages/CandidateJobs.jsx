import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Link, useLocation } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';
import { Button, Col, Container, Modal, Pagination, Row, Table } from 'react-bootstrap';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CandidateJobs = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;

  const [jobs, setJobs] = useState([]);
  const [applyjobs, setApplyJobs] = useState([]);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (search) {
      fetchJobBySearch();
    } else {
      fetchData();
    }
  }, [page, pageSize, search, sortedColumn, sortOrder]);

  async function fetchData() {
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/paginationJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleApplyButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowResumePopup(true);
  };

  const handleResumeSelect = async (resumeId) => {
    if (selectedJobId && resumeId) {
      await applyJob(selectedJobId, resumeId);
      setSelectedJobId(null);
      setShowResumePopup(false);
    }
  };

  const applyJob = async (jobId, resumeId) => {
    const appliedOn = new Date().toLocaleDateString();
    try {
      const response = await axios.put(`${BASE_API_URL}/applyJob`, null, {
        params: { jobId, userId, appliedOn, resumeId },
      });
      if (response.data) {
        setApplyJobs((prevApplyJobs) => [...prevApplyJobs, { jobId, appliedOn }]);
        setHasUserApplied((prev) => ({ ...prev, [jobId]: true }));
        alert("You have successfully applied for this job");
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

  const fetchJobBySearch = async () => {
    try {
      const params = {
        search: search,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/searchJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchJobBySearch();
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };

  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  const user = {
    userName: userName,
    userId: userId,
  };

  return (
    <div className='candidate-dashboard-container'>
      <div className='left-side'>
      <CandidateLeftSide user={{ userName: userName, userId: userId }} />

      </div>

      <div className='rightside'>
        {showResumePopup && (
          <Modal show={showResumePopup} onHide={() => setShowResumePopup(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Resume Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ResumeSelectionPopup
                resumes={resumes}
                onSelectResume={handleResumeSelect}
                onClose={() => setShowResumePopup(false)}
              />
            </Modal.Body>
          </Modal>
        )}

        <Container className="page">
          <Row className="top-right-content candidate-search">
            <Col xs={9} md={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="align-items-center">
                  <Col xs={9}>
                    <Form.Control
                      type='text'
                      name='search'
                      placeholder='Search'
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </Col>
                  <Col xs={3}>
                    <Button type="submit" variant="primary">
                      <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
            <Col xs={3} md={2}>
              <div className="user-icon">
                <FontAwesomeIcon
                  icon={faUser}
                  className='icon'
                  style={{ color: 'black', cursor: 'pointer', fontSize: '1.5em' }}
                  onClick={toggleSettings}
                />
              </div>
            </Col>
          </Row>
          {showSettings && (
            <Modal show={showSettings} onHide={toggleSettings} centered>
              <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ul>
                  <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/">Sign out</Link></li>
                  <li>Setting</li>
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={toggleSettings}>Close</Button>
              </Modal.Footer>
            </Modal>
          )}

          {jobs.length > 0 ? (
            <div>
              <h2>Jobs For {userName}</h2>
              <Table striped bordered hover className='jobs-table'>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('jobTitle')}>
                      Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>
                      Company Name
                    </th>
                    <th onClick={() => handleSort('applicationDeadline')}>
                      Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('skills')}>
                      Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th>Job Summary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} id='job-table-list'>
                      <td>{job.jobTitle}</td>
                      <td>{job.companyName}</td>
                      <td>{job.applicationDeadline}</td>
                      <td>{job.skills}</td>
                      <td>
                        <Button onClick={() => handleViewSummary(job.jobsummary)}>View Summary</Button>
                      </td>
                      <td>
                        {hasUserApplied[job.jobId] === true || (applyjobs && applyjobs.jobId === job.jobId) ? (
                          <h4>Applied</h4>
                        ) : (
                          <Button variant="primary" onClick={() => handleApplyButtonClick(job.jobId, job.jobStatus)}>
                            Apply
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {selectedJobSummary && (
                <Modal show={!!selectedJobSummary} onHide={handleCloseModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Job Summary</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{selectedJobSummary}</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                  </Modal.Footer>
                </Modal>
              )}

              <nav className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev onClick={handlePreviousPage} disabled={page === 0} />
                  {[...Array(totalPages).keys()].map((pageNumber) => (
                    <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                      {pageNumber + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={handleNextPage} disabled={page === totalPages - 1} />
                </Pagination>
              </nav>

            </div>
          ) : (
            <h1>No jobs found.</h1>
          )}

          <div className="dream">
            <p>Can't find your dream company. Don't worry, you can still apply to them.</p>
            <p>Just add the name of your dream company and apply to them directly.</p>
            <Link to={{ pathname: '/dream-company', state: { userName: userName, userId: userId } }} className="app">
              <Button variant="primary" className="apply" style={{ textAlign: 'center' }}>
                <b>Apply to your dream company</b>
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CandidateJobs;
