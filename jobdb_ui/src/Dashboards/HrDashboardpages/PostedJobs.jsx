import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HrLeftSide from './HrLeftSide';

const PostedJobs = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userEmail = location.state?.userEmail;
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)



  const fetchJobs = async () => {
    try {
      const params = {
        userEmail: userEmail,
        page: page,
        size: pageSize,
        sortBy: sortedColumn, // Include sortedColumn and sortOrder in params
        sortOrder: sortOrder,
      };

      const response = await axios.get(`${BASE_API_URL}/jobsPostedByHrEmaileachCompany`, { params });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs data:', error);
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

  const fetchJobBysearch = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/searchJobsByCompany`, {
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
    } else {
      fetchJobs();
    }
  }, [userEmail, page, pageSize, sortedColumn, sortOrder, search]);


  const [showJobDescription, setShowJobDescription] = useState(false);


  const navigate = useNavigate();
  const toggleSettings = () => {
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const [selectedJobSummary, setSelectedJobSummary] = useState(null);

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

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

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
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return convertToUpperCase(nameParts[0][0] + nameParts[1][0]);
    } else {
      return convertToUpperCase(nameParts[0][0] + nameParts[0][1]);
    }
  };

  const initials = getInitials(userName);
  return (
    <div fluid className="dashboard-container">
        <div md={2} className="left-side">
          <HrLeftSide user={{ userName, userEmail }} />
     

      
        </div>
      
        <div md={10} className="rightside" style={{
          overflowY: 'scroll'
        }}>          <div className="d-flex justify-content-end align-items-center mb-3 mt-12">
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

          <div className="jobs_list">
            {jobs.length > 0 ? (
              <div>
                <div>
                  <Table hover className='text-center'>
                    <thead className="table-light">
                      <tr>
                        <th scope="col" onClick={() => handleSort('hrName')}>Hr Name{sortedColumn === 'hrName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th scope="col">Company Name</th>
                        <th scope="col" onClick={() => handleSort('jobTitle')}>Job Title{sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th scope="col" onClick={() => handleSort('numberOfPosition')}>Vacancy{sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                        <th scope="col">Job Description</th>
                        <th scope="col" onClick={() => handleSort('applicationDeadline')}>Application Deadline{sortedColumn === 'applicationDeadline' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job.id}>
                          <td>{job.userName}</td>
                          <td>{job.companyName}</td>
                          <td><a onClick={() => handleViewSummary(job.jobsummary)}>{job.jobTitle}</a></td>
                          <td>{job.jobType}</td>
                          <td>{job.skills}</td>
                          <td>{job.numberOfPosition}</td>
                          <td>
                            <OverlayTrigger trigger="click" placement="left" overlay={popover(job.jobsummary)} style={{ fontSize: '20px' }}>
                              <Button variant="secondary" className='description btn-rounded' >Description</Button>
                            </OverlayTrigger>
                          </td>
                          <td>{job.applicationDeadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

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
              </div>
            ) : (
              <p>No jobs available.</p>
            )}
          </div>

      
        </div>
        </div>
  );
}

export default PostedJobs;
