
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Popover } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

import { Dropdown, Pagination } from 'react-bootstrap';

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
  const [showSettings, setShowSettings] = useState(false);
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
    setShowModalSummary(true);
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
    userName,
    userId,
  };





  return (
    
    <div className='candidate-dashboard-container'>
      <div className='left-side'>
        <CandidateLeftSide user={user} />
      </div>

      <div className='rightside'>
       
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

        <div className="d-flex justify-content-end">
          <div className="top-right-content">
            <div className="candidate-search">
              <form className="candidate-search1" onSubmit={handleSubmit}>
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  value={search}
                  onChange={handleSearchChange}
                />
                <Button variant="light" onClick={() => alert('Search clicked')}>
                  <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                </Button>
              </form>
              <div className="user col px-3 header-part-right">
                <Dropdown>
                  <Dropdown.Toggle as="span" className="toggle-hidden cursor-pointer">
                    <FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} />
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
            </div>
          </div>


        </div>

        {jobs.length > 0 && (
          <div>
            <h2>Jobs For {userName}</h2>
            <table className='jobs-table'>
              <thead>
                <tr>
                  <th onClick={() => handleSort('jobTitle')}>
                    Job Profile {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th >
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
                    <td><button onClick={() => handleViewSummary(job.jobsummary)}>View Summary</button></td>
                    <td>
                      {hasUserApplied[job.jobId] === true || (applyjobs && applyjobs.jobId === job.jobId) ? (
                        <h4>Applied</h4>
                      ) : (
                        <Button onClick={() => handleApplyButtonClick(job.jobId)}>Apply</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedJobSummary && (
              <div className="modal-summary">
                <div className="modal-content-summary">
                  <span className="close" onClick={handleCloseModalSummary}>&times;</span>
                  <div className="job-summary">
                    <h3>Job Summary</h3>
                    <p>{selectedJobSummary}</p>
                  </div>
                </div>
              </div>
            )}

            <nav>
              <Pagination>
                <Pagination.Prev onClick={handlePreviousPage} disabled={page === 0} />
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={handleNextPage} disabled={page === totalPages - 1} />
              </Pagination>
            </nav>
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

      </div>
    </div>
  );
};

export default CandidateJobs;







