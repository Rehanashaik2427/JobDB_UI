import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
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

  const fetchJobs = async (userEmail) => {
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
    }
    else
      fetchJobs(userEmail);
  }, [userEmail, search, page, pageSize, sortedColumn, sortOrder]);

  const [showSettings, setShowSettings] = useState(false);


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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    fetchJobBysearch();
  };


  const handlePageClick = (data) => {
    setPage(data.selected);
  };




  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={2} className="left-side">
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

          <div className="jobs_list">
            {jobs.length > 0 && (
              <div><div>
                <Table hover className='text-center'>
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('hrName')}>Hr Name{sortedColumn === 'hrName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col">Company Name</th>
                      <th scope="col" onClick={() => handleSort('jobTitle')}>Job Title{sortedColumn === 'jobTitle' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('jobType')}>Job Type{sortedColumn === 'jobType' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('skills')}>Skills{sortedColumn === 'skills' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('numberOfPosition')}>Vacancy{sortedColumn === 'numberOfPosition' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
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
                        <td>{job.applicationDeadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
                {selectedJobSummary && (
                  <div className="modal-summary">
                    <div className="modal-content-summary">
                      <span className="close" onClick={handleCloseModal}>&times;</span>
                      <h2>Job Summary</h2>
                      <p>{selectedJobSummary}</p>
                    </div>
                  </div>
                )}

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
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PostedJobs;
