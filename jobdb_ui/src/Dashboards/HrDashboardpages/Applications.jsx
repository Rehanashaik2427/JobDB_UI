import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const Applications = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";

  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;



  const [jobs, setJobs] = useState('')
  const [search, setSearch] = useState('');
  const currentPage = location.state?.currentPage || 0;
  const [page, setPage] = useState(currentPage); 
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)
  const [loading, setLoading] = useState(true);

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
    setPage(0); // Reset page when page size change
  };


  useEffect(() => {
    
    if (search) {
      fetchJobBysearch();
    }
    else{
      fetchJobs()
    }
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage !== null) {
      setPage(Number(storedPage));
    }
  }, [userEmail, search, page, pageSize, sortOrder, sortedColumn]);



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

  console.log("page", page)

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }
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



  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };


  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);
    localStorage.setItem('currentPage', selectedPage);
  };

  const convertToUpperCase = (str) => {
    return String(str).toUpperCase();
  };
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };
const state1 = location.state || {};
  console.log(state1)
  console.log("current page from update job",currentPage)

  const initials = getInitials(userName);
  useEffect(() => {
    if (location.state?.currentPage === undefined) {
      setPage(0);
    }
  }, [location.state?.currentPage]);
  return (

    <div className='dashboard-container'>
      <div className='left-side'>
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
            <div className='job-list'>
              <Table hover className='text-center'>
                <thead className="table-light">
                  <tr>
                    <th scope="col" onClick={() => handleSort('jobTitle')}>
                      Job Title {sortedColumn === 'jobTitle' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'jobTitle' && sortOrder === 'desc' && '▼'}
                    </th>
                    <th scope="col" onClick={() => handleSort('applicationDeadline')}>Application DeadLine{sortedColumn === 'applicationDeadline' && sortOrder === 'asc' && '▲'}
                      {sortedColumn === 'applicationDeadline' && sortOrder === 'desc' && '▼'}</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    (
                      <tr key={job.jobId}>
                        <td>{job.jobTitle}</td>
                        <td>{job.applicationDeadline}</td>
                        <td>
                          <Link
                            to="/hr-dashboard/hr-applications/view-applications"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/hr-dashboard/hr-applications/view-applications', { state: { userName: userName, userEmail: userEmail, jobId: job.jobId,currentPage: page } });
                            }}
                            className="nav-link"
                          >
                            <Button>View Application</Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </Table>


            </div>
          </>
        ) : (
          <section>
            <h2>You have not posted any jobs yet. Post Now</h2>
          </section>
        )}
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
            forcePage={page}
          />
        </div>

      </div>
    </div>


  );
}

export default Applications;
