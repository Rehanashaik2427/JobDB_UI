import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Dropdown, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
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
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);


  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageClick = (data) => {
    setPage(data.selected); // Update the page state with the new selected page index
  };




  const fetchJobs = async () => {
    setLoading(true);
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
      setLoading(false);
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
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.log("Error searching:", error);
      alert("Error searching for jobs. Please try again later.");
    }

  }
  useEffect(() => {
    if (search) {
      fetchJobBysearch();
    } else {
      fetchJobs();
    }
  }, [userEmail, page, pageSize, sortedColumn, sortOrder, search]);


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
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
  };
  const [showLeftSide, setShowLeftSide] = useState(false);
  const toggleLeftSide = () => {
    setShowLeftSide(!showLeftSide);
  };

  return (
    <div fluid className="dashboard-container">
     
     
        <div md={2} className={`left-side ${showLeftSide ? 'show' : ''}`}>
          <HrLeftSide user={{ userName, userEmail }} />
        </div>
        <div className="hamburger-icon" onClick={toggleLeftSide}>
          <FaBars />
        </div>
        <div md={10} className="rightside" style={{
          overflowY: 'scroll'
        }}>          
        <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
            <div className="search-bar">
              <input
                style={{ borderRadius: '6px', height: '35px' }}
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
                <Dropdown.Item as={Link} to="/" onClick={() => navigate('/')}>
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-bubble spinner-bubble-primary m-5" />
              <span>Loading...</span>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <h2 className='text-center'>Jobs posted by {userName}</h2>
              <div>
                <div>
                  <Table hover className='text-center'>
                    <thead className="table-light">
                      <tr>
                        <th scope="col" onClick={() => handleSort('jobTitle')}>
                          Job Title {sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('jobType')}>
                          Job Type {sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('postingDate')}>
                          Posting Date {sortedColumn === 'postingDate' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('skills')}>
                          Skills {sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('numberOfPosition')}>
                          No of Position {sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('salary')}>
                          Salary {sortedColumn === 'salary' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('applicationDeadline')}>
                          Application Deadline {sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col">Job Description</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.jobId}>
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className="cursor-pointer text-success me-2 update" onClick={() => navigate('/hr-dashboard/my-jobs/update-job', { state: { userName, userEmail, jobId: job.jobId } })}>
                                <MdEdit size={18} className="text-success" />
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
                                  }
                                });
                              }}>
                                <MdDelete className="text-danger" size={18} />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

              </div>
            </>
          ) : (
            <section>
              <h2>You have not posted any jobs yet. Post Now</h2>
            </section>
          )}


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
          {!loading && jobs.length >= 0 && (
            <Button className='add-job-button btn-info position-absolute top-70 start-40 translate-middle'>
              <Link
                to={{ pathname: '/hr-dashboard/my-jobs/addJob', state: { userName, userEmail } }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/hr-dashboard/my-jobs/addJob', { state: { userName, userEmail } });
                }}
              >
                Add Job
              </Link>
            </Button>
          )}
        </div>

   </div>


  );
};

export default MyJobs;
