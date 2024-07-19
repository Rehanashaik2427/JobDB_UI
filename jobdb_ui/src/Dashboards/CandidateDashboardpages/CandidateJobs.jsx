import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Modal, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CandidateLeftSide from './CandidateLeftSide';
import ResumeSelectionPopup from './ResumeSelectionPopup';

const BASE_API_URL = "http://localhost:8082/api/jobbox";

const CandidateJobs = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applyjobs, setApplyJobs] = useState([]);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [hasUserApplied, setHasUserApplied] = useState({});
  const [selectedJobSummary, setSelectedJobSummary] = useState(null);
  const [showModalSummary, setShowModalSummary] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const handleFilterChange = async (e) => {
    debugger
    const status = e.target.value
      setFilterStatus(status);
      
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
  };
  useEffect(() => {
    if (search) {
      fetchJobBySearch();
    } else if(filterStatus) {
      fetchDataByFilter(filterStatus);   
    }else{
      fetchData();
    }
  }, [page, pageSize, search, sortedColumn, sortOrder, filterStatus]);

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

  async function fetchDataByFilter(filterStatus) {
    console.log(filterStatus)
    try {
      const params = {
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
        userId: userId, // Example parameter to pass to backend API
        filterStatus:filterStatus
      };
    console.log(filterStatus)


      // if (filterStatus === 'Apply') {
      //   // Fetch jobs where user has not applied
      //   params.userId = userId; // Example parameter to pass to backend API
      // } else if (filterStatus === 'Applied') {
      //   // Fetch jobs where user has applied
      //   params.userId = 0; // Example parameter to pass to backend API
      // }

      const response = await axios.get(`${BASE_API_URL}/paginationFilterJobs`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
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
        search:search,
        page:page,
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

        <Col md={10} className="rightside" style={{
          overflowY: 'scroll'
        }}>

          {showResumePopup && (
            <ResumeSelectionPopup
            resumes={resumes}
            onSelectResume={handleResumeSelect}
            onClose={() => setShowResumePopup(false)}
          />
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
                <Dropdown.Item as={Link} to="/">
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="filter">
            <label htmlFor="status">Actions:</label>
            <select id="status" onChange={handleFilterChange} value={filterStatus}>
              <option value="all">All</option>
              <option value="Apply">Apply</option>
              <option value="Applied">Applied</option>
            </select>
          </div>
          {jobs.length > 0 && (
            <div style={{ marginLeft: '5px', marginRight: '50px' }}> 
            
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>Jobs For {userName}</h2>
                
              </div>
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
