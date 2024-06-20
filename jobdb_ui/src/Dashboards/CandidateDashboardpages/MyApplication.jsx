import { faSearch, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Link, useLocation } from 'react-router-dom';

import './CandidateDashboard.css';
import CandidateLeftSide from './CandidateLeftSide';
import { Button, Col, Container, Modal, Pagination, Table } from 'react-bootstrap';

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
        userId:userId,
        page: page,
        size: pageSize,
        sortBy :sortedColumn,
        sortOrder :sortOrder,

    };
      const response = await axios.get(`${BASE_API_URL}/applicationsPagination`,{params});
  
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
        userId:userId,
        page: page,
        pageSize: pageSize,
      };
      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }
      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`,{ params });
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications by status:', error);
    }
  };

  const fetchApplicationBySearch=async()=>{
    try {
      const params = {
        searchStatus: search,
        userId:userId,
        page: page,
        pageSize: pageSize,
      };
      if (sortedColumn) {
        params.sortBy = sortedColumn;
        params.sortOrder = sortOrder;
      }
      const response = await axios.get(`${BASE_API_URL}/applicationsBySearch`,{ params });
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
      
    }else if(search) {
      fetchApplicationBySearch(search);
    
    } else {
      fetchApplications();
     
    }

  }, [applicationStatus, page, pageSize,search,sortOrder,sortedColumn,userId]);
  

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
    if(jobId===0){
      return 'Job not availavle, HR not mapped';
    }
    else{
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
    <div className='candidate-dashboard-container'>
      <div className='left-side'>
      <CandidateLeftSide user={{ userName: userName, userId: userId }} />

      </div>
      <div className='rightside'>
        <Container>
          <div className="top-right-content">
            <div className="candidate-search">
              <Form onSubmit={handleSubmit} className="candidate-search1">
                <Form.Row className="align-items-center">
                  <Col xs={9}>
                    <Form.Control
                      type='text'
                      name='search'
                      placeholder='Search'
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </Col>
                  <Col xs={3}>
                    <Button type="submit">
                      <FontAwesomeIcon icon={faSearch} style={{ color: 'skyblue' }} />
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
              <div>
                <FontAwesomeIcon
                  icon={faUser}
                  id="user"
                  className='icon'
                  style={{ color: 'black' }}
                  onClick={toggleSettings}
                />
              </div>
            </div>
            {showSettings && (
              <Modal show={showSettings} onHide={toggleSettings} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ul>
                    <li><FontAwesomeIcon icon={faSignOutAlt} /><Link to="/"> Sign out</Link></li>
                    <li>Setting</li>
                  </ul>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={toggleSettings}>Close</Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
          <div>
            {applications.length > 0 ? (
              <div>
                <h2>My Applications</h2>
                <div className='applications-table'>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('companyName')}>
                          Company Name {sortedColumn === 'companyName' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => handleSort('jobRole')}>
                          Job Title {sortedColumn === 'jobRole' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => handleSort('appliedOn')}>
                          Applied On {sortedColumn === 'appliedOn' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th>Resume Profile</th>
                        <th>Job Status</th>
                        <th onClick={() => handleSort('applicationStatus')}>
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
                  <Pagination>
                    <Pagination.Prev onClick={handlePreviousPage} disabled={page === 0} />
                    {[...Array(totalPages).keys()].map((pageNumber) => (
                      <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                        {pageNumber + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={handleNextPage} disabled={page === totalPages - 1} />
                  </Pagination>
                </nav>
              </div>
            ) : (
              <h1>No applications found.</h1>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default MyApplication;
   