import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
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
  const [selectedJobSummary, setSelectedJobSummary] = useState('');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default to 5 items per page
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size changes
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmail`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  };

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
      setJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const fetchJobBySearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByHR`, {
        params: { search, userEmail, page, pageSize }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching for jobs. Please try again later.');
    }
  };

  useEffect(() => {
    if (search) {
      fetchJobBySearch();
    } else {
      fetchJobs();
    }
  }, [userEmail, page, pageSize, sortedColumn, sortOrder, search]);

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };

  const getInitials = (name) => {
    if (!name) return '';
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

  const handleViewSummary = (summary) => {
    setSelectedJobSummary(summary);
  };

  const handleCloseModal = () => {
    setSelectedJobSummary(null);
  };

  return (
    <div className="dashboard-container">
      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <HrLeftSide user={{ userName, userEmail }} />
      </div>

      <div className="right-side">
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
            <Table hover className='text-center'>
              <thead className="table-light">
                <tr>
                  {['jobTitle', 'jobType', 'postingDate', 'skills', 'numberOfPosition', 'salary', 'applicationDeadline'].map((column) => (
                    <th
                      key={column}
                      scope="col"
                      onClick={() => handleSort(column)}
                    >
                      {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      {sortedColumn === column && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                    </th>
                  ))}
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
                    <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          className="cursor-pointer text-success me-2 update"
                          onClick={() => navigate('/hr-dashboard/my-jobs/update-job', { state: { userName, userEmail, jobId: job.jobId } })}
                        >
                          <MdEdit size={18} className="text-success" />
                        </span>
                        <span
                          className='delete cursor-pointer text-danger me-2'
                          onClick={() => {
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
                          }}
                        >
                          <MdDelete className="text-danger" size={18} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
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
              <Button className='add-job-button position-relative top-70 start-40 translate-middle'>
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
          </>
        ) : (
          <div>No jobs available.</div>
        )}

        {selectedJobSummary && (
          <div className="modal-summary">
            <div className="modal-content-summary">
              <span className="close" onClick={handleCloseModal}>&times;</span>
              <div className="job-summary">
                <h3>Job Summary</h3>
                <pre>{selectedJobSummary}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
