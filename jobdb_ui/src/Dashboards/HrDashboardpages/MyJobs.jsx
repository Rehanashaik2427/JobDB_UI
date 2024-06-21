import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HrDashboard.css';
import HrLeftSide from './HrLeftSide';

const MyJobs = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const [jobs, setJobs] = useState([]);

  const [showJobDescription, setShowJobDescription] = useState(false);
  const [selectedJobSummary, setSelectedJobSummary] = useState('');

  const navigate = useNavigate();

  const [search, setSearch] = useState('');

 
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);


  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const toggleSettings = () => {
    navigate('/');
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    // setPage(0);
  };


  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    }
    else
      fetchJobs()
  }, [userEmail, search, page, pageSize]);





  const fetchJobs = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmail`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  }



  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };


  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`${BASE_API_URL}/deleteJob?jobId=${jobId}`);
      // Remove the job from the frontend list
      setJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const fetchJobBysearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      console.log(response.data);
    } catch (error) {
      console.log("Error searching:", error);
      alert("Error searching for jobs. Please try again later.");
    }

  }
  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    }
    else
      fetchJobs()
  }, [userEmail, page, pageSize, sortedColumn, sortOrder]);

  const handleJobDescription = (summary) => {
    setSelectedJobSummary(summary);
    setShowJobDescription(true);
  };

  const closeJobDescription = () => {
    setShowJobDescription(false);
    setSelectedJobSummary('');
  };



  return (
    <Container fluid className="hr-dashboard-container">
      <Row>
        <Col md={3} className="hr-leftside">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={9} className="hr-rightside">
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
         

          {showJobDescription && (
            <div className="modal-summary">
              <div className="modal-content-summary">
                <span className="close" onClick={closeJobDescription}>&times;</span>
                <h2>Job Description</h2>
                <pre>{selectedJobSummary}</pre>
              </div>
            </div>
          )}
          <h2>Job posted by {userName}</h2>
          <div className='job-list'>
            {jobs.length > 0 && (

              <table id='jobTable1'>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'jobTitle' && sortOrder === 'desc' && '▼'}
                    </th>
                    <th onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('postingDate')}> PostingDate {sortedColumn === 'postingDate' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('numberOfPosition')}>No of Position{sortedColumn === 'numberOfPosition' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('applicationDeadline')}>Application DeadLine{sortedColumn === 'applicationDeadline' && (sortOrder === ' ' ? '▲' : '▼')}</th>
                    <th>Job Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {currentJobs.map(job => ( */}
                  {jobs.map(job => (
                    job.jobId !== 0 && (
                      <tr key={job.id}>
                        <td>{job.jobTitle}</td>
                        <td>{job.jobType}</td>
                        <td>{job.postingDate}</td>
                        <td>{job.skills}</td>
                        <td>{job.numberOfPosition}</td>
                        <td>{job.applicationDeadline}</td>
                        <td>
                          <button className='description' onClick={() => handleJobDescription(job.jobsummary)}>Description</button>
                        </td>
                        <td>
                          <Button
                            className='update'
                            onClick={() => navigate('/hr-dashboard/my-jobs/update-job', {
                              state: {
                                userName: userName,
                                userEmail: userEmail,
                                jobId: job.jobId,
                              }
                            })}
                          >
                            Update
                          </Button>

                          <button className='delete' onClick={() => handleDelete(job.jobId)}>Delete</button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>

            )}

            {jobs.length === 0 && (
              <section className='not-yet'>
                <h2>You have not posted any jobs yet. Post Now</h2>
              </section>
            )}

          </div>
          <nav>
            <ul className='pagination'>
              <li>
                <button className='page-button' onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
              </li>
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <li key={pageNumber} className={pageNumber === page ? 'active' : ''}>
                  <button className='page-link' onClick={() => handlePageChange(pageNumber)}>{pageNumber + 1}</button>
                </li>
              ))}
              <li>
                <button className='page-button' onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
              </li>
            </ul>
          </nav>


          <button className='add-job-button'>
            <Link
              to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName: userName, userEmail: userEmail } }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/hr-dashboard/my-jobs/addJob', { state: { userName: userName, userEmail: userEmail } });
              }}
            >
              Add Job
            </Link>          </button>
        </Col>
      </Row>
    </Container>

  );
};

export default MyJobs;
