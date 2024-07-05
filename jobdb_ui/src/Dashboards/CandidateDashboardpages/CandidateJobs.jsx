
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import './CandidateDashboard.css';

import ReactPaginate from 'react-paginate';
import CandidateLeftSide from './CandidateLeftSide';

import { Dropdown } from 'react-bootstrap';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CandidateJobs = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  console.log(userId);

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applyjobs, setApplyJobs] = useState([]);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const [showModalSummary, setShowModalSummary] = useState(false);


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


  const toggleSettings = () => {
    navigate('/');
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
        search,
        page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/searchJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);

      const statuses = await Promise.all(response.data.content.map(job => hasUserApplied(job.jobId, userId)));
      const statusesMap = {};
      response.data.content.forEach((job, index) => {
        statusesMap[job.jobId] = statuses[index];
      });

    } catch (error) {
      console.log("No data Found" + error);
    }
    console.log("Search submitted:", search);
  };


  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };



  const handleCloseModalSummary = () => {
    setSelectedJobSummary(null);
    setShowModalSummary(false);
  };

  const popover = (summary) => (
    <Popover id="popover-basic" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <Popover.Body>
        {summary}
        <span className="float-end" onClick={handleCloseModalSummary} style={{ cursor: 'pointer' }}>
          <i className="fas fa-times"></i> {/* Close icon */}
        </span>
      </Popover.Body>
    </Popover>
  );

  const user = {
    userName: userName,
    userId: userId,
  };



  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return ''; // Handle case where name is undefined
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };
  const initials = getInitials(userName);
  return (
    <Container fluid className='dashboard-container'>
      <Row>
        <Col md={2} className="left-side">
          <CandidateLeftSide user={user} />
        </Col>

        <Col md={18} className="rightside" style={{
          overflow: 'hidden'
        }}>
          {showResumePopup && (
            <Modal show={true} onHide={() => setShowResumePopup(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Select Resume</Modal.Title>
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

          <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
            <div className="search-bar" >
              <input style={{ borderRadius: '6px', height: '35px' }}
                type="text"
                name="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <Dropdown className="ml-2">
              <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                <div
                  className="initials-placeholder"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'grey',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {initials}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="mt-3">
                <Dropdown.Item as={Link} to="/">
                  <i className="i-Data-Settings me-1" /> Account settings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {jobs.length > 0 && (
            <div>
              {/* <h2>Jobs For {userName}</h2> */}
              <Table hover className='text-center' style={{ marginLeft: '5px', marginRight: '12px' }}>
                <thead className="table-light">
                  <tr>
                    <th scope='col' onClick={() => handleSort('jobTitle')}>
                      Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                    <th scope='col' onClick={() => handleSort('companyName')}>
                      Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
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
                      <td>{job.companyName}</td>
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

              <div className="pagination-container">
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

          {jobs.length === 0 && <h1>No jobs found.</h1>}

          <div className="dream">
            <p>Can't find your dream company. Don't worry, you can still apply to them.</p>
            <p>Just add the name of your dream company and apply to them directly.</p>
            <Link to={{ pathname: '/candidate-dashboard/dream-company', state: { userName: userName, userId: userId } }} className="app d-flex justify-content-center" onClick={(e) => {
              e.preventDefault();
              navigate('/candidate-dashboard/dream-company', { state: { userName, userId } });
            }}>
              <Button variant="primary" className="apply">
                Apply to your dream company
              </Button>
            </Link>
          </div>



        </Col>
      </Row>
    </Container>
  );
};

export default CandidateJobs;