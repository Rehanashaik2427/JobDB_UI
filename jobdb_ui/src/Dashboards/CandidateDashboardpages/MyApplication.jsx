
import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';

const MyApplication = () => {
  const BASE_API_URL = "http://localhost:8082/api/jobbox";
  const location = useLocation();
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const applicationStatus = location.state?.applicationStatus;
  const [showSettings, setShowSettings] = useState(false);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [resumeNames, setResumeNames] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);


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
  const fetchApplicationsByStatus = async () => {
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

  const fetchApplicationBySearch = async () => {
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
    if (applicationStatus) {
      fetchApplicationsByStatus(applicationStatus);

    } else if (search) {
      fetchApplicationBySearch(search);

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
    setShowSettings(!showSettings);
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
      return 'Job not availavle, HR not mapped';
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

  const user = {
    userName: userName,
    userId: userId,
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3} className="leftside">
          <CandidateLeftSide user={{ userName, userId }} />
        </Col>

        <Col md={18} className="rightside">


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
                <button type="submit">
                  <FontAwesomeIcon icon={faSearch} className='button' style={{ color: 'skyblue' }} />
                </button>
              </form>
              <div><FontAwesomeIcon icon={faUser} id="user" className='icon' style={{ color: 'black' }} onClick={toggleSettings} /></div>
            </div>
            {showSettings && (
              <div id="modal-container">
                <div id="settings-modal">

                  <ul>
                    <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sing out</Link></li>
                    <li>Setting </li>

                  </ul>
                  <button onClick={toggleSettings}>Close</button>
                </div>
              </div>
            )}
          </div>
          <div>
            {applications.length > 0 ? (
              <div>
                <h2 className='text-center'>My Applications</h2>
                <div>
                  {/* <h1 style={{ textAlign: 'center' }}>MY APPLICATIONS</h1> */}
                  <div className='applications-table'>
                  <Table hover className='text-center'>
                <thead className="table-light">

                        <tr>
                          <th scope="col" onClick={() => handleSort('companyName')}>Company Name{sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                          <th scope="col"onClick={() => handleSort('jobRole')}>Job Title{sortedColumn === 'jobRole' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
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
                </div>
              </div>
            ) : (
              <h1>No applications found.</h1>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MyApplication;
