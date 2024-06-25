import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
import { MdDelete, MdEdit } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'; // Import SweetAlert2
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


  const closeJobDescription = () => {
    setShowJobDescription(false);
    setSelectedJobSummary('');
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
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

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className="leftside">
          <HrLeftSide user={{ userName, userEmail }} />
        </Col>

        <Col md={20} className="rightside">
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
                <FontAwesomeIcon icon={faUser} id="user" className="icon" style={{ color: 'black' }} />
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

          {showJobDescription && (
            <div className="modal-summary">
              <div className="modal-content-summary">
                <span className="close" onClick={closeJobDescription}>&times;</span>
                <h2>Job Description</h2>
                <pre>{selectedJobSummary}</pre>
              </div>
            </div>
          )}
          <h2 className='text-center'>Job posted by {userName}</h2>

          <div className='job-list'>
            {jobs.length > 0 && (

              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'jobTitle' && sortOrder === 'desc' && '▼'}
                    </th>
                    <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'jobType' && sortOrder === 'desc' && '▼'}</th>
                    <th scope="col" onClick={() => handleSort('postingDate')}> PostingDate {sortedColumn === 'postingDate' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'postingDate' && sortOrder === 'desc' && '▼'}</th>
                    <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'skills' && sortOrder === 'desc' && '▼'}</th>
                    <th scope="col" onClick={() => handleSort('numberOfPosition')}>No of Position{sortedColumn === 'numberOfPosition' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'numberOfPosition' && sortOrder === 'desc' && '▼'}</th>
                    <th scope="col" onClick={() => handleSort('salary')}>Salary{sortedColumn === 'salary' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'salary' && sortOrder === 'desc' && '▼'}</th>

                    <th scope="col" onClick={() => handleSort('applicationDeadline')}>Application DeadLine{sortedColumn === 'applicationDeadline' && sortOrder === 'asc' && '▲'}
                    {sortedColumn === 'applicationDeadline' && sortOrder === 'desc' && '▼'}</th>

                    <th scope="col">Job Description</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {currentJobs.map(job => ( */}
                  {jobs.map(job => (
                    job.jobId && (
                      <tr key={job.id}>
                        <td>{job.jobTitle}</td>
                        <td>{job.jobType}</td>
                        <td>{job.postingDate}</td>
                        <td>{job.skills}</td>
                        <td>{job.numberOfPosition}</td>
                        <td>{job.salary}</td>
                        <td>{job.applicationDeadline}</td>
                        <td>
                          <OverlayTrigger trigger="click" placement="left" overlay={popover(job.jobsummary)} style={{ fontSize: '20px' }}>
                            <Button variant="secondary" className='description btn-rounded' >Description</Button>
                          </OverlayTrigger>
                        </td>
                        <td>
                          <span className="cursor-pointer text-success me-2 update" onClick={() => navigate('/hr-dashboard/my-jobs/update-job', { state: { userName: userName, userEmail: userEmail, jobId: job.jobId } })}>
                          <MdEdit
                                  size={18}
                                  className="text-success" />
                          </span>
                          <span className='delete cursor-pointer text-danger me-2' onClick={() => {
                            swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!"
                            }).then((result) => {
                              if (result.isConfirmed) {
                                handleDelete(job.jobId);
                                swal.fire(
                                  'Deleted!',
                                  'Your job has been deleted.',
                                  'success'
                                )
                              }
                            });
                          }}>
                            <MdDelete className="text-danger" size={18} />
                          </span>

                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </Table>

            )}

            {jobs.length === 0 && (
              <section className='not-yet'>
                <h2>You have not posted any jobs yet. Post Now</h2>
              </section>
            )}

          </div>

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


          <Button className='add-job-button btn-info position-absolute top-70 start-40 translate-middle'>
            <Link
              to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName: userName, userEmail: userEmail } }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/hr-dashboard/my-jobs/addJob', { state: { userName: userName, userEmail: userEmail } });
              }}
            >
              Add Job
            </Link>
          </Button>
        </Col>
      </Row>
    </Container>

  );
};

export default MyJobs;
