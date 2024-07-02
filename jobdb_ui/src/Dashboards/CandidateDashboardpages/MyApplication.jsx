
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';


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
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeNames();
  }, [applications]);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber === page + 1) {
      handleNextPage();

    } else if (pageNumber === page - 1) {
      handlePreviousPage();

    } else {
      setPage(pageNumber);
      if (applicationStatus) {
        fetchApplicationsByStatus(applicationStatus);
      } else if (search) {
        fetchApplicationBySearch(search);
      } else {
        fetchApplications();
      }
      fetchResumeNames();
    }
  };
  const [sortedColumn, setSortedColumn] = useState(null); // Track the currently sorted column
  const [sortOrder, setSortOrder] = useState(' '); // Track the sort order (asc or desc)

  // Update fetchApplications function to include the search term
  const fetchApplications = async () => {
    try {
      const params = {
        userId: userId,
        page: page,
        size: pageSize,
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

  // Update fetchApplicationsByStatus function to include the search term
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
  }

  // Call the appropriate fetch function based on the existence of searchStatus
  useEffect(() => {
    if (search) {
      fetchApplicationBySearch(search);

    } else if (applicationStatus) {
     
      fetchApplicationsByStatus(applicationStatus);

    } else {
      fetchApplications();

    }

  }, [applicationStatus, page, pageSize, search, sortOrder, sortedColumn, userId]);


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





  const handleSort = (column) => {
    let order = 'asc';
    if (sortedColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortedColumn(column);
    setSortOrder(order);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    handlePageChange(0);

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

  // Function to get job status for a specific job ID
  const getJobStatus = async (jobId) => {
    if (jobId === 0) {
      return 'Job not availavle';
    }
    else {
      try {
        const response = await axios.get(`${BASE_API_URL}/getJob?jobId=${jobId}`);
        return response.data.jobStatus ? 'Active' : 'Not Active';
      } catch (error) {
        console.error("Error fetching job status:", error);
        throw error;
      }
    }
  };

  // Render job status based on application ID
  const renderJobStatus = (applicationId) => {
    return jobStatuses[applicationId] || 'Loading...';
  };
  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const user = {
    userName: userName,
    userId: userId,
  };

  return (

    <Container fluid className='dashboard-container'>
      <Row>
        <Col md={2} className="left-side">
          <CandidateLeftSide user={user} />
        </Col>

        <Col md={18} className="rightside" style={{
          overflow: 'hidden'
        }}>
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
        <div>
          {applications.length > 0 ? (
            <>
              {/* Applications table */}
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

              {/* Pagination */}
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
              </>
              ) : (
              <h4 className='text-center'>No Application .!!</h4>
            )}
           
           </div>
           </Col>
      </Row>
    </Container>
      );
}
export default MyApplication;


