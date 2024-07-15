import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import { FaBars } from 'react-icons/fa';

const MyApplication = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const applicationStatus = location.state?.applicationStatus;
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [resumeNames, setResumeNames] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeNames();
  }, [applications]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };
  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setPageSize(size);
   // setPage(0); // Reset page when page size changes
  };

  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

  useEffect(() => {
    if (search) {
      fetchApplicationBySearch(search);
    } else if (applicationStatus) {
      fetchApplicationsByStatus(applicationStatus);
    } else {
      fetchApplications();
    }
  }, [applicationStatus, page, pageSize, search, sortOrder, sortedColumn, userId]);


  const fetchApplications = async () => {
    try {
      const params = {
        userId: userId,
        page: page,
        pageSize: pageSize,
        sortBy: sortedColumn,
        sortOrder: sortOrder,
      };
      
      const response = await axios.get(`${BASE_API_URL}/applicationsPagination`, { params });

      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchApplicationsByStatus = async (applicationStatus) => {
    try {
      const params = {
        searchStatus: applicationStatus,
        userId: userId,
        page: page,
        pageSize: pageSize,
      };
      
      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by status:', error);
    }
  };

  const fetchApplicationBySearch = async (search) => {
    try {
      const params = {
        searchStatus: search,
        userId: userId,
        page: page,
        pageSize: pageSize,
      };
      
      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }

      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`, { params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by search:', error);
    }
    console.log("Search submitted:", search);
  };


  const fetchResumeNames = async () => {
    const names = {};
    try {
      for (const application of applications) {
        const name = await getResumeName(application.resumeId);
        names[application.resumeId] = name;
      }
      setResumeNames(names);
    } catch (error) {
      console.error('Error fetching resume names:', error);
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

  const toggleSettings = () => {
    navigate('/');
  };

  const getResumeName = async (resumeId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/getResumeMessageById?resumeId=${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume name:', error);
      return 'Unknown';
    }
  };

  const [jobStatuses, setJobStatuses] = useState({});

  useEffect(() => {
    const fetchJobStatuses = async () => {
      const statuses = {};
      for (const application of applications) {
        try {
          const status = await getJobStatus(application.jobId);
          statuses[application.applicationId] = status;
        } catch (error) {
          console.error('Error fetching job status:', error);
          statuses[application.id] = 'Unknown';
        }
      }
      setJobStatuses(statuses);
    };

    fetchJobStatuses();
  }, [applications]);

  const getJobStatus = async (jobId) => {
    if (jobId === 0) {
      return 'Job not available';
    } else {
      try {
        const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${jobId}`);
        return response.data.jobStatus ? 'Active' : 'Not Active';
      } catch (error) {
        console.error("Error fetching job status:", error);
        throw error;
      }
    }
  };

  const renderJobStatus = (applicationId) => {
    return jobStatuses[applicationId] || 'Loading...';
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
        <Col md={10} className="rightside">
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
                <Dropdown.Item as={Link} to="/" onClick={toggleSettings}>
                  <i className="i-Lock-2 me-1" /> Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={{ marginLeft: '5px', marginRight: '50px' }}>
            {applications.length > 0 ? (
              <>
                <Table hover className='text-center' style={{ marginLeft: '5px', marginRight: '12px' }}>
                  <thead className="table-light">
                    <tr>
                      <th scope="col" onClick={() => handleSort('companyName')}>Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('jobRole')}>Job Title{sortedColumn === 'jobRole' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col" onClick={() => handleSort('appliedOn')}>Applied On{sortedColumn === 'appliedOn' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                      <th scope="col">Resume Profile</th>
                      <th scope="col">Job Status</th>
                      <th scope="col" onClick={() => handleSort('applicationStatus')}>
                        Action {sortedColumn === 'applicationStatus' && (sortOrder === 'asc' ? '▲' : '▼')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(application => (
                      <tr key={application.id}>
                        <td>{application.companyName}</td>
                        <td>{application.jobRole}</td>
                        <td>{application.appliedOn}</td>
                        <td>{resumeNames[application.resumeId]}</td>
                        <td>{renderJobStatus(application.applicationId)}</td>
                        <td>{application.applicationStatus}</td>
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
              </>
            ) : (
              <h4 className='text-center'>No Application found..!!</h4>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyApplication;
