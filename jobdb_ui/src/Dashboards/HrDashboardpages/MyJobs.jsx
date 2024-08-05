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
  const [pageSize, setPageSize] = useState(2); // Default to 5 items per page
  const [totalPages, setTotalPages] = useState(0);

  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  
  // const currentPage = location.state?.currentPage || 0;
   const [page, setPage] = useState(0); 

   const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1)); // Ensure selectedPage is within range
    setPage(selectedPage);
    localStorage.setItem('currentJobPage', selectedPage); // Store the page number in localStorage
  };
   useEffect(() => {
    if (search) {
      fetchJobBySearch();
    } else {
      fetchJobs();
    }
   
  }, [userEmail, page, pageSize, sortedColumn, sortOrder, search]);
  useEffect(() => {
    const storedPage = localStorage.getItem('currentJobPage');
    if (storedPage !== null) {
      const parsedPage = Number(storedPage);
      if (parsedPage < totalPages) {
        setPage(parsedPage);
        console.log(page);
      }
    }
  }, [totalPages]);
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
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
  
  // useEffect(() => {
  //   if (location.state?.currentPage === undefined) {
  //     setPage(0);
  //   }
  // }, [location.state?.currentPage]);

  console.log("page", page)
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
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };
  const isLastPage = page === totalPages - 1;
 const isPageSizeDisabled = isLastPage;
 
  return (
    <div className='dashboard-container'>

      <div className={`left-side ${showLeftSide ? 'show' : ''}`}>
        <HrLeftSide user={{ userEmail, userName }} />
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
              <div className='table-details-list'>
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
                        <td><Button variant="secondary" className='description btn-rounded' onClick={() => handleViewSummary(job.jobsummary)}>Summary</Button></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="cursor-pointer text-success me-2 update" onClick={() => navigate('/hr-dashboard/my-jobs/update-job', { state: { userName, userEmail, jobId: job.jobId, currentPage: page } })}>
                              <MdEdit size={18} className="text-success" />
                            </span>
                            <span className='delete cursor-pointer text-danger me-2' onClick={() => {
                              swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
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

        <div className="pagination-container d-flex justify-content-end align-items-center">
          <div className="page-size-select me-3">
            <label htmlFor="pageSize">Page Size:</label>
            <select id="pageSize" onChange={handlePageSizeChange} value={pageSize} disabled={isPageSizeDisabled}>
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
            forcePage={page < totalPages ? page : totalPages - 1} // Adjust forcePage to valid range
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
      </div>
    </div>
  );
};

export default MyJobs;
